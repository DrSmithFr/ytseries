import { SeasonModel } from './season.model';

export class SeriesModel {
  id: number;
  import_code: string;
  name: string;
  image: string;
  locale: string;
  description: string;
  seasons: SeasonModel[];
}
