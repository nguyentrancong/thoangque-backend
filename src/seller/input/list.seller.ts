export class ListSellers {
  createDate?: CreateProductFilter = CreateProductFilter.All;
  updateDate?: UpdateProductFilter = UpdateProductFilter.All;
  keyword?: string;
  orderBy?: ProductOrderBy = ProductOrderBy.DESC;
}

export enum CreateProductFilter {
  All = 1,
  Today,
  ThisWeek,
  Yesterday,
  LastWeek,
}

export enum UpdateProductFilter {
  All = 1,
  Today,
  ThisWeek,
  Yesterday,
  LastWeek,
}

export enum ProductOrderBy {
  DESC = "DESC",
  ASC = "ASC",
}
