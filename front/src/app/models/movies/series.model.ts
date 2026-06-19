import { SeasonDto, SeasonMapper, SeasonModel } from './season.model';
import { AbstractMapper, FieldEmptyError } from '../abstract-mapper';
import { inject, Injectable } from '@angular/core';

export interface SeriesDto {
  id?: number;
  import_code?: string;
  name?: string;
  image?: string;
  locale?: string;
  type?: string;
  categories?: string[];
  tags?: string[];
  description?: string;
  seasons?: SeasonDto[];
  import_date?: number;
  created_at?: string;
}

export class SeriesModel {
  constructor(
    public id: number,
    public import_code: string,
    public name: string,
    public image: string,
    public locale: string,
    public type: string,
    public categories: string[],
    public tags: string[],
    public description: string,
    public seasons: SeasonModel[],
    public import_date: Date,
    public created_at: Date
  ) {
  }

  isRecent(): boolean {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.created_at > oneMonthAgo;
  }
}

@Injectable({ providedIn: 'root' })
export class SeriesMapper extends AbstractMapper<SeriesDto, SeriesModel> {
  override fromDto(model: SeriesDto): SeriesModel {
    if (!(model.tags instanceof Array)) {
      throw new FieldEmptyError()
    }

    return new SeriesModel(
      this.mapNumber(model.id, 0),
      this.mapString(model.import_code, ''),
      this.mapString(model.name),
      this.mapString(model.image),
      this.mapString(model.locale),
      this.mapString(model.type),
      this.mapArray<string>(model.categories, this.mapString, []),
      this.mapArray<string>(model.tags, this.mapString, []),
      this.mapString(model.description),
      this.mapModels(model.seasons, inject(SeasonMapper), []),
      this.mapTimestamp(model.import_date),
      this.mapDate(model.created_at, new Date()),
    );
  }

  override toDto(model: SeriesModel): SeriesDto {
    return {
      id: model.id,
      import_code: model.import_code,
      name: model.name,
      image: model.image,
      locale: model.locale,
      type: model.type,
      categories: model.categories,
      tags: model.tags,
      description: model.description,
      seasons: inject(SeasonMapper).toDtos(model.seasons),
      import_date: model.import_date.getUTCMilliseconds(),
      created_at: model.created_at.toDateString(),
    } as SeriesDto;
  }
}
