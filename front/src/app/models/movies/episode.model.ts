// episode.model.ts
import { AbstractMapper } from '../abstract-mapper';
import { Injectable } from '@angular/core';

export interface EpisodeDto {
  id?: number;
  rank?: number;
  code?: string;
  name?: string;
  duration?: number;
  created_at?: string;
}

export class EpisodeModel {
  constructor(
    public id: number,
    public rank: number,
    public code: string,
    public name: string,
    public duration: number,
    public created_at: Date,
  ) {
  }
}

@Injectable({ providedIn: 'root' })
export class EpisodeMapper extends AbstractMapper<EpisodeDto, EpisodeModel> {
  /** Convert a DTO into a Model */
  override fromDto(dto: EpisodeDto): EpisodeModel {
    return new EpisodeModel(
      this.mapNumber(dto.id),            // id
      this.mapNumber(dto.rank),          // rank
      this.mapString(dto.code),          // code
      this.mapString(dto.name),          // name
      this.mapNumber(dto.duration),      // duration
      this.mapDate(dto.created_at),      // created_at (expects a string or Date)
    );
  }

  /** Convert a Model into a DTO */
  override toDto(model: EpisodeModel): EpisodeDto {
    return {
      id: model.id,
      rank: model.rank,
      code: model.code,
      name: model.name,
      duration: model.duration,
      created_at: model.created_at.toDateString(),
    } as EpisodeDto;
  }
}
