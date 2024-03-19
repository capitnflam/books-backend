import {
  BookRequest,
  BookResult,
  BooksResultItem,
  BooksResultItemInput,
  bookResultSchema,
  booksResultItemSchema,
} from '@flaminc/books-types'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import { Repository } from 'typeorm'

import { Filtering } from '../decorators/filtering-parameters'
import { Sorting } from '../decorators/sorting-parameters'
import { getOrder, getWhere } from '../decorators/transformers/typeorm'

import { BookEntity } from './entity'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
  ) {}

  async getAll(
    options: IPaginationOptions,
    sort?: Sorting<BookEntity>[],
    filter?: Filtering<BookEntity>[],
  ): Promise<Pagination<BooksResultItem>> {
    const order = getOrder(sort)
    const where = getWhere(filter)
    const requestResult = await paginate<BooksResultItemInput>(
      this.booksRepository,
      options,
      {
        select: { authors: { id: true } },
        relations: ['authors'],
        order,
        where,
      },
    )

    return new Pagination<BooksResultItem>(
      requestResult.items.map((item) => booksResultItemSchema.parse(item)),
      requestResult.meta,
      requestResult.links,
    )
  }

  async get(id: number): Promise<BookResult> {
    const book = await this.booksRepository.findOne({
      select: {
        authors: { id: true },
      },
      where: { id },
      relations: ['authors'],
    })

    if (!book) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }

    return bookResultSchema.parse(book)
  }

  async update(id: number, data: BookRequest): Promise<BookResult> {
    const { uri, authors, ...rest } = data
    await this.booksRepository.save({
      ...rest,
      id: Number.parseInt(uri.slice('/book/'.length)),
      authors: authors.map((author) => ({
        id: Number.parseInt(author.slice('/author/'.length)),
      })),
    })

    return this.get(id)
  }
}
