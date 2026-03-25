import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  UseGuards, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../libs/common/src/guards/roles.guard';
import { CurrentUser } from '../../../../../libs/common/src/decorators/current-user.decorator';
import { User } from '../../../../auth/src/entities/user.entity';

@ApiTags('addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users/addresses')
export class AddressesController {
  constructor(private readonly service: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all delivery addresses for current user' })
  findAll(@CurrentUser() user: User) {
    return this.service.findAllForUser(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a delivery address' })
  create(@CurrentUser() user: User, @Body() dto: CreateAddressDto) {
    return this.service.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a delivery address' })
  update(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a delivery address' })
  remove(@CurrentUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(user.id, id);
  }
}
