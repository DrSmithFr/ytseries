import { EpisodeModel } from './episode.model';

export class SeasonModel {
  id: number;
  rank: number;
  name: string;
  episodes: EpisodeModel[];
  created_at: Date;
}
