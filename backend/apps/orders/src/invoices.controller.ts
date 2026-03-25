import {
  Controller, Get, Param, Query, Res,
  UseGuards, ParseUUIDPipe, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard } from '../../../libs/common/src/guards/roles.guard';
import { Roles } from '../../../libs/common/src/decorators/roles.decorator';
import { CurrentUser } from '../../../libs/common/src/decorators/current-user.decorator';
import { Role } from '../../../libs/common/src/enums/role.enum';
import { User } from '../../auth/src/entities/user.entity';

@ApiTags('invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // ── Customer ─────────────────────────────────────────────────

  @Get('mine')
  @ApiOperation({ summary: 'List current user invoices' })
  myInvoices(@CurrentUser() user: User) {
    return this.invoicesService.findByUser(user.id);
  }

  @Get('mine/:id/pdf')
  @ApiOperation({ summary: 'Download invoice PDF' })
  async downloadMyPdf(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const buffer = await this.invoicesService.generatePdf(id, user.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${id.slice(0, 8)}.pdf"`);
    res.send(buffer);
  }

  // ── Admin ─────────────────────────────────────────────────────

  @Get('admin')
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] List all invoices' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  adminList(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query('search') search?: string,
  ) {
    return this.invoicesService.adminList(+page, +limit, search);
  }

  // SECURITY: literal route must appear before parameterised sibling to prevent
  // NestJS matching "export" as a UUID param if a bare admin/:id route is ever added.
  @Get('admin/export')
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] Export all invoices as CSV' })
  async exportCsv(@Res() res: Response) {
    const csv = await this.invoicesService.exportCsv();
    const filename = `invoices-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }

  @Get('admin/:id/pdf')
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] Download any invoice PDF' })
  async adminDownloadPdf(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const { buffer, invoice } = await this.invoicesService.generatePdfAdmin(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    );
    res.send(buffer);
  }
}
