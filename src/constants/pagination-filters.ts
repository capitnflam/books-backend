import { FilterOperator, FilterSuffix } from 'nestjs-paginate'

export const paginationFilterRelationalOperators = [
  FilterOperator.EQ,
  FilterOperator.GT,
  FilterOperator.GTE,
  FilterOperator.LT,
  FilterOperator.LTE,
  FilterOperator.BTW,
  FilterSuffix.NOT,
]
export const paginationFilterIDOperators = [FilterOperator.EQ, FilterSuffix.NOT]
export const paginationFilterTextOperators = [
  FilterOperator.EQ,
  FilterOperator.ILIKE,
  FilterOperator.CONTAINS,
  FilterSuffix.NOT,
]
