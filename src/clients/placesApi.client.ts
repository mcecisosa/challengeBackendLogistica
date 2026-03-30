import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';

interface PlaceApiResponse {
  status: string;
  result?: {
    formatted_address: string;
    geometry: { location: { lat: number; lng: number } };
  };
}

export interface PlaceApiInfo {
  address: string;
  latitude: number;
  longitude: number;
}

@Injectable()
export class PlacesApiClient {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>(
      'PLACES_API_URL',
      'https://maps.googleapis.com/maps/api/place/details/json?',
    );

    this.apiKey = this.configService.get<string>('PLACES_API_KEY', '');
  }

  async getPlaceData(place_id: string): Promise<PlaceApiInfo | null> {
    try {
      const url = `${this.apiUrl}place_id=${place_id}&key=${this.apiKey}`;

      const response: AxiosResponse<PlaceApiResponse> = await axios.get(url);

      if (response.data.status !== 'OK' || !response.data.result) return null;

      const data: PlaceApiInfo = {
        address: response.data.result.formatted_address,
        latitude: response.data.result.geometry.location.lat,
        longitude: response.data.result.geometry.location.lng,
      };

      return data;
    } catch (error) {
      console.error(
        `Error fetching Places API with place_id${place_id}`,
        error,
      );
      return null;
    }
  }
}
