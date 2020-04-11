import {FilterModel} from './filter.model';
import {AssetModel} from './asset.model';

export class SearchResponseModel {
    assets: AssetModel[];
    filters: Map<string, FilterModel[]>;
}
