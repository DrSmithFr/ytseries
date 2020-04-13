import {FilterModel} from './filter.model';
import {AssetModel} from './asset.model';

export class SearchResponseModel {
  assets: AssetModel[];
  filters: {
    locales: FilterModel[],
    types: FilterModel[],
    categories: FilterModel[]
  };
}
