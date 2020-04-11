import { EpisodeModel } from './episode.model';

export class SeasonModel {
  id: number;
  rank: number;
  name: string;
  episodes: EpisodeModel[];
  // tslint:disable-next-line:variable-name
  created_at: Date;
}
