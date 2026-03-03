import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('stats')
  getStats() {
    return this.admin.getStats();
  }

  @Get('users')
  getAllUsers() {
    return this.admin.getAllUsers();
  }

  @Post('users/:id/disable')
  disableUser(@Param('id') id: string) {
    return this.admin.disableUser(id);
  }

  @Post('users/:id/enable')
  enableUser(@Param('id') id: string) {
    return this.admin.enableUser(id);
  }

  @Get('vehicles')
  getAllVehicles() {
    return this.admin.getAllVehicles();
  }

  @Post('vehicles')
  createVehicle(@Body() body: any) {
    return this.admin.createVehicle(body);
  }

  @Delete('vehicles/:id')
  deleteVehicle(@Param('id') id: string) {
    return this.admin.deleteVehicle(id);
  }
}
