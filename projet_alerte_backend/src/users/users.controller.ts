import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('registrer')
  async register(@Body() userData: Partial<User>): Promise<User> {
    try {
      return await this.userService.create(userData);
    } catch (error) {
      console.error("Erreur serveur détaillée (register):", error);
      throw new HttpException({
        message: 'Erreur lors de la création de l\'utilisateur.',
        details: error.message || error.toString()
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
