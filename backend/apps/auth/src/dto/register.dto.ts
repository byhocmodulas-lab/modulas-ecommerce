import { IsEmail, IsString, IsOptional, MinLength, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, SELF_REGISTER_ROLES } from '../../../../libs/common/src/enums/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  @MaxLength(254) // RFC 5321 max email length
  email: string;

  @ApiProperty({ minLength: 8, description: 'Min 8 chars, must include letter + number' })
  @IsString()
  @MinLength(8)
  @MaxLength(128) // prevent bcrypt DoS via oversized input
  password: string;

  @ApiPropertyOptional({ example: 'Jane Smith' })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({
    enum: SELF_REGISTER_ROLES,
    default: Role.Customer,
    description: 'Requested role — architect/vendor require admin approval',
  })
  @IsEnum(SELF_REGISTER_ROLES)
  @IsOptional()
  role?: (typeof SELF_REGISTER_ROLES)[number];
}
