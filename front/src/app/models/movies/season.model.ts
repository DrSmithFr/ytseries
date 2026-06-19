import { EpisodeDto, EpisodeMapper, EpisodeModel } from './episode.model';
import { AbstractMapper } from '../abstract-mapper';
import { inject, Injectable } from '@angular/core';

export class SeasonDto {
  id?: number;
  rank?: number;
  name?: string;
  episodes?: EpisodeDto[];
  created_at?: string
}

export class SeasonModel {
  constructor(
    public id: number,
    public rank: number,
    public name: string,
    public episodes: EpisodeModel[],
    public created_at: Date,
  ) {
  }
}

@Injectable({ providedIn: 'root' })
export class SeasonMapper extends AbstractMapper<SeasonDto, SeasonModel> {
  override fromDto(dto: SeasonDto): SeasonModel {
    return new SeasonModel(
      this.mapNumber(dto.id),
      this.mapNumber(dto.rank),
      this.mapString(dto.name),
      this.mapModels(dto.episodes, inject(EpisodeMapper)),
      this.mapDate(dto.created_at)
    );
  }

  override toDto(model: SeasonModel): SeasonDto {
    return {
      id: model.id,
      rank: model.rank,
      name: model.name,
      episodes: inject(EpisodeMapper).toDtos(model.episodes),
      created_at: model.created_at.toDateString()
    } as SeasonDto;
  }
}
