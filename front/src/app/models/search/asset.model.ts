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
    // tslint:disable-next-line:variable-name
    import_date: number;

    get isMovie(): boolean {
        return this.seasons === 1 && this.episodes === 1;
    }

    get isMonoSeasons(): boolean {
        return this.seasons === 1;
    }
}

