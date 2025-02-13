import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, SetMetadata, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { EditUserDto } from './dto';
import { RolesGuard } from '../../src/auth/guard/roles.guard';
import { formatUser } from '../../src/auth/utils/format-user';
import { ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { UserEntity } from './entities';

@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  @ApiCreatedResponse({
    type: UserEntity,
    isArray: false
  })
  @SetMetadata('permissions', ['get:own:user', 'pairer:user'])
  getMe(@GetUser() user: User) {
    return formatUser(user);
  }

  @Get('admin/:userId')
  @ApiCreatedResponse({
    type: UserEntity,
    isArray: false
  })
  @SetMetadata('permissions', ['pairer:user'])
  async getUserById(@Param('userId') userId: string) {
    console.log('Here...');
    return formatUser(await this.userService.getUserById(userId));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('admin/:userId')
  @ApiNoContentResponse()
  @SetMetadata('permissions', ['pairer:user'])
  async deleteUserById(@Param('userId') userId: string) {
    await this.userService.deleteUserById(userId);
  }

  @Patch('')
  @ApiCreatedResponse({
    type: UserEntity,
    isArray: false
  })
  @SetMetadata('permissions', ['patch:own:user'])
  async editUser(@Body() dto: EditUserDto, @GetUser('userId') userId: string) {
    return formatUser(await this.userService.editUser(userId, dto));
  }
}
