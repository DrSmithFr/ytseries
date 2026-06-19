// api-message.model.ts
import { AbstractMapper } from '../abstract-mapper';
import { Injectable } from '@angular/core';

export interface ApiMessageDto {
  code?: number;
  message?: string;
}

export class ApiMessageModel {
  constructor(
    public code: number,
    public message: string
  ) {}
}

@Injectable({ providedIn: 'root' })
export class ApiMessageMapper extends AbstractMapper<ApiMessageDto, ApiMessageModel> {
  override fromDto(dto: ApiMessageDto): ApiMessageModel {
    return new ApiMessageModel(
      this.mapNumber(dto.code),
      this.mapString(dto.message)
    );
  }

  override toDto(model: ApiMessageModel): ApiMessageDto {
    return {
      code: model.code,
      message: model.message
    } as ApiMessageDto;
  }
}
