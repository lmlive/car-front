import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehicles: VehiclesService) {}

  @Get()
  findByUser(@Request() req: any) {
    return this.vehicles.findByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicles.findOne(id);
  }

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.vehicles.create(req.user.sub, body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.vehicles.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.vehicles.delete(id);
  }
}
