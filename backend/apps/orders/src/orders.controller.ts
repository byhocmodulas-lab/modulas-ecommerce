import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, UseGuards, HttpCode, HttpStatus, ParseUUIDPipe, Res,
} from '@nestjs/common';
import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard } from '../../../libs/common/src/guards/roles.guard';
import { Roles } from '../../../libs/common/src/decorators/roles.decorator';
import { CurrentUser } from '../../../libs/common/src/decorators/current-user.decorator';
import { Role } from '../../../libs/common/src/enums/role.enum';
import { OrderStatus } from './entities/order.entity';
import { User } from '../../auth/src/entities/user.entity';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly paymentsService: PaymentsService,
  ) {}

  // ─── Cart ─────────────────────────────────────────────────────

  @Get('cart')
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@CurrentUser() user: User) {
    return this.ordersService.getCart(user.id);
  }

  @Post('cart/items')
  @ApiOperation({ summary: 'Add item to cart' })
  addToCart(@CurrentUser() user: User, @Body() dto: AddCartItemDto) {
    return this.ordersService.addToCart(user.id, dto);
  }

  @Patch('cart/items/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update quantity of a cart item' })
  updateCartQty(
    @CurrentUser() user: User,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: { quantity: number; configurationId?: string },
  ) {
    return this.ordersService.updateCartQty(user.id, productId, dto.quantity, dto.configurationId);
  }

  @Delete('cart/items/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove item from cart' })
  removeFromCart(
    @CurrentUser() user: User,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('configurationId') configurationId?: string,
  ) {
    return this.ordersService.removeFromCart(user.id, productId, configurationId);
  }

  // ─── Checkout ─────────────────────────────────────────────────

  @Post('checkout')
  @ApiOperation({ summary: 'Convert cart to order and return checkout URL' })
  checkout(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {
    return this.ordersService.checkout(user.id, {
      shippingAddress: dto.shippingAddress as unknown as Record<string, unknown>,
      currency: dto.currency,
      affiliateCode: dto.affiliateCode,
      notes: dto.notes,
    });
  }

  // ─── Admin orders view ────────────────────────────────────────

  @Get('admin')
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] Paginated orders list with optional status filter' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  adminListOrders(
    @Query('status') status?: OrderStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.ordersService.adminListOrders({ status, page: +page, limit: +limit });
  }

  // ─── Orders ───────────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Place a new order directly (without cart)' })
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: User) {
    return this.ordersService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List orders (admin sees all; customer sees own)' })
  findAll(@CurrentUser() user: User) {
    return this.ordersService.findAll(user);
  }

  @Get('by-status')
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] Filter orders by status' })
  @ApiQuery({ name: 'status', enum: OrderStatus })
  byStatus(@Query('status') status: OrderStatus) {
    return this.ordersService.getOrdersByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.ordersService.findOne(id, user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (admin) or cancel own pending order (customer)' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.updateStatus(id, dto, user);
  }

  // ── Stripe: create PaymentIntent for an order ─────────────────

  @Post(':id/payment-intent')
  @ApiOperation({ summary: 'Create Stripe PaymentIntent for a pending order' })
  createPaymentIntent(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.paymentsService.createPaymentIntent(id, user.id, user.email);
  }

  // ── Razorpay: create Razorpay order ───────────────────────────

  @Post(':id/razorpay-order')
  @ApiOperation({ summary: 'Create Razorpay order for a pending order' })
  createRazorpayOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.paymentsService.createRazorpayOrder(id, user.id);
  }

  // ── Razorpay: verify payment signature ────────────────────────

  @Post(':id/razorpay-verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Razorpay payment signature and confirm order' })
  verifyRazorpayPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    },
  ) {
    return this.paymentsService.verifyRazorpayPayment(id, user.id, dto);
  }

  // ── Admin: export orders CSV ──────────────────────────────────

  @Get('admin/export')
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] Export orders as CSV' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'from',   required: false })
  @ApiQuery({ name: 'to',     required: false })
  async exportOrders(
    @Query('status') status?: OrderStatus,
    @Query('from')   from?: string,
    @Query('to')     to?: string,
    @Res() res?: Response,
  ) {
    const csv = await this.ordersService.exportCsv({ status, from, to });
    const filename = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    res!.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res!.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res!.send(csv);
  }
}
