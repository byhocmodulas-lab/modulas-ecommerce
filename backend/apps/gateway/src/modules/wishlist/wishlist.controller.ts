import {
  Controller, Get, Post, Delete, Body, Param,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../libs/common/src/guards/roles.guard';
import { CurrentUser } from '../../../../../libs/common/src/decorators/current-user.decorator';
import { User } from '../../../../auth/src/entities/user.entity';

class AddWishlistDto {
  @IsString() productId: string;
}

class SyncWishlistDto {
  @IsArray() @IsString({ each: true }) productIds: string[];
}

@ApiTags('wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly service: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get wishlist for current user' })
  get(@CurrentUser() user: User) {
    return this.service.getForUser(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add product to wishlist' })
  add(@CurrentUser() user: User, @Body() dto: AddWishlistDto) {
    return this.service.add(user.id, dto.productId);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove product from wishlist' })
  remove(@CurrentUser() user: User, @Param('productId') productId: string) {
    return this.service.remove(user.id, productId);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sync local wishlist to server on login' })
  sync(@CurrentUser() user: User, @Body() dto: SyncWishlistDto) {
    return this.service.sync(user.id, dto.productIds);
  }
}
