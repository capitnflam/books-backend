import { BooksResultItemInput } from '@flaminc/books-types'
import { PaginateConfig, PaginationType } from 'nestjs-paginate'

import {
  paginationFilterIDOperators,
  paginationFilterRelationalOperators,
  paginationFilterTextOperators,
} from '../constants/pagination-filters'

export const PAGINATION_CONFIG: PaginateConfig<BooksResultItemInput> = {
  sortableColumns: [
    'createdAt',
    'deletedAt',
    'updatedAt',
    'id',
    'isbn',
    'title',
  ],
  paginationType: PaginationType.LIMIT_AND_OFFSET,
  defaultLimit: 10,
  maxLimit: 100,
  relations: ['authors'],
  filterableColumns: {
    createdAt: paginationFilterRelationalOperators,
    deletedAt: paginationFilterRelationalOperators,
    updatedAt: paginationFilterRelationalOperators,
    id: paginationFilterIDOperators,
    isbn: paginationFilterTextOperators,
    title: paginationFilterTextOperators,
  },
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
}
