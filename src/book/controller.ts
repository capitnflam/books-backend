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
import { Paginate, PaginateQuery, PaginatedSwaggerDocs } from 'nestjs-paginate'
import { ZodValidationPipe } from 'nestjs-zod'

import { http } from '../constants/http'

import { PAGINATION_CONFIG } from './constants'
import { BookEntity } from './entity'
import { BookService } from './service'

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @Header(http.headers.CONTENT_TYPE, http.mime.APPLICATION_JSON)
  @PaginatedSwaggerDocs(BookEntity, PAGINATION_CONFIG)
  getBooks(@Paginate() query: PaginateQuery) {
    return this.bookService.getAll(query)
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
