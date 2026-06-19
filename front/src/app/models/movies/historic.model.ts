// historic.model.ts
import { AbstractMapper } from '../abstract-mapper';
import { Injectable } from '@angular/core';

export interface HistoricDto {
  episode_id?: number;
  time_code?: number;
}

export class HistoricModel {
  constructor(
    public episode_id: number,
    public time_code: number
  ) {
  }
}

@Injectable({ providedIn: 'root' })
export class HistoricMapper extends AbstractMapper<HistoricDto, HistoricModel> {
  override fromDto(dto: HistoricDto): HistoricModel {
    return new HistoricModel(
      this.mapNumber(dto.episode_id),
      this.mapNumber(dto.time_code),
    );
  }

  override toDto(model: HistoricModel): HistoricDto {
    return {
      episode_id: model.episode_id,
      time_code: model.time_code,
    } as HistoricDto;
  }
}
