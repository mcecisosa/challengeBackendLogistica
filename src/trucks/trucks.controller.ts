import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ParseObjectIdPipe } from '@nestjs/mongoose';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TrucksService } from './trucks.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { TruckResponseDto } from './dto/truck-response.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';

@ApiTags('Trucks')
@Controller('trucks')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new truck' })
  @ApiBody({ type: CreateTruckDto })
  @ApiCreatedResponse({
    description: 'The truck has been succesfully created',
    type: TruckResponseDto,
  })
  async create(
    @Body() createTruckDto: CreateTruckDto,
  ): Promise<TruckResponseDto> {
    const newTruck = await this.trucksService.create(createTruckDto);
    return newTruck;
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get trucks' })
  @ApiOkResponse({
    description: 'Return all trucks',
    type: TruckResponseDto,
    isArray: true,
  })
  async findAll() {
    const trucks = await this.trucksService.findAll();
    return trucks;
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a truck by id' })
  @ApiParam({ name: 'id', description: 'The truck id' })
  @ApiOkResponse({
    description: 'Returns the truck with the specified id',
    type: TruckResponseDto,
  })
  async findById(@Param('id', ParseObjectIdPipe) id: string) {
    const truck = await this.trucksService.findById(id);
    return truck;
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiBody({ type: UpdateTruckDto })
  @ApiCreatedResponse({
    description: 'The truck has been succesfully updated',
    type: TruckResponseDto,
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTruckDto: UpdateTruckDto,
  ) {
    const updatedTruck = await this.trucksService.update(id, updateTruckDto);

    return updatedTruck;
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a truck' })
  delete(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return this.trucksService.delete(id);
  }
}
