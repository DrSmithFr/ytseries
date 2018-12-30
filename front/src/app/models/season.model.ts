import {EpisodeModel} from "./episode.model";
export class SeasonModel {
  id: number;
  rank: number;
  name: string;
  description: string;
  episodes: EpisodeModel[];
  created_at: Date;
}
