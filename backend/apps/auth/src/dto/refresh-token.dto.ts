import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token (from httpOnly cookie or body)' })
  @IsString()
  refreshToken: string;
}
