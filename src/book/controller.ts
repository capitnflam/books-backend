import { type BookRequest, bookRequestSchema } from '@flaminc/books-types'
import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'

import { http } from '../constants/http'
import {
  Filtering,
  FilteringParametersGenerator,
} from '../decorators/filtering-parameters'
import {
  type Pagination,
  PaginationParameters,
} from '../decorators/pagination-parameters'
import {
  Sorting,
  SortingParametersGenerator,
} from '../decorators/sorting-parameters'

import { BookEntity } from './entity'
import { BookService } from './service'

const SortingParameters = SortingParametersGenerator<BookEntity>()
const FilteringParameters = FilteringParametersGenerator<BookEntity>()

@Controller('books?')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @Header(http.headers.CONTENT_TYPE, http.mime.APPLICATION_JSON)
  getBooks(
    @PaginationParameters({ defaultValues: { limit: 10, page: 1 } })
    pagination: Pagination,
    @SortingParameters({
      allowedProperties: [
        'createdAt',
        'deletedAt',
        'id',
        'isbn',
        'updatedAt',
        'title',
      ],
    })
    sort?: Sorting<BookEntity>[],
    @FilteringParameters({
      allowedProperties: [
        'createdAt',
        'deletedAt',
        'isbn',
        'synopsis',
        'title',
        'updatedAt',
      ],
    })
    filter?: Filtering<BookEntity>[],
  ) {
    return this.bookService.getAll(pagination, sort, filter)
  }

  @Get(':id')
  @Header(http.headers.CONTENT_TYPE, http.mime.APPLICATION_JSON)
  getBook(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.get(id)
  }

  @Put(':id')
  @Header(http.headers.CONTENT_TYPE, http.mime.APPLICATION_JSON)
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(bookRequestSchema)) body: BookRequest,
  ) {
    return this.bookService.update(id, body)
  }
}
