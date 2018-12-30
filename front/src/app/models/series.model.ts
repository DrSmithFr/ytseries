import {SeasonModel} from "./season.model";
export class SeriesModel {
  id: number;
  name: string;
  locale: string;
  description: string;
  seasons: SeasonModel[];
}
