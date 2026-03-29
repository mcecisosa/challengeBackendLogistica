import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationResponseDto } from './dto/location-response.dto';

@ApiTags('Location')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationsService: LocationService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiBody({ type: CreateLocationDto })
  @ApiCreatedResponse({
    description: 'The location has been succesfully created',
    type: LocationResponseDto,
  })
  async create(
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<LocationResponseDto> {
    const newLocation = await this.locationsService.create(createLocationDto);
    return LocationResponseDto.fromEntity(newLocation);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get locations' })
  @ApiOkResponse({
    description: 'Return all locations',
    type: LocationResponseDto,
    isArray: true,
  })
  async findAll(): Promise<LocationResponseDto[]> {
    const locations = await this.locationsService.findAll();
    return locations.map((loc) => LocationResponseDto.fromEntity(loc));
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a location by id' })
  @ApiParam({ name: 'id', description: 'The location id' })
  @ApiOkResponse({
    description: 'Returns the location with the specified id',
    type: LocationResponseDto,
  })
  async findById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<LocationResponseDto> {
    const location = await this.locationsService.findById(id);
    return LocationResponseDto.fromEntity(location);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a location' })
  @ApiBody({ type: UpdateLocationDto })
  @ApiOkResponse({
    description: 'The location has been succesfully updated',
    type: LocationResponseDto,
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<LocationResponseDto> {
    const updatedLocation = await this.locationsService.update(
      id,
      updateLocationDto,
    );

    return LocationResponseDto.fromEntity(updatedLocation);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse({ description: 'Location deleted successfully' })
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a location' })
  delete(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return this.locationsService.delete(id);
  }
}
