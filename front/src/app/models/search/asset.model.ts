export class AssetModel {
  id: string;
  locale: string;
  name: string;
  image: string;
  type: string;
  description: string;
  categories: string[];
  tags: string[];
  seasons: number;
  episodes: number;
  import_date: Date;

  get isMovie(): boolean {
    return this.seasons == 1 && this.episodes == 1;
  }

  get isMonoSeasons(): boolean {
    return this.seasons == 1;
  }
}

