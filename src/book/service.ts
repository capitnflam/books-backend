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
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'

import { PAGINATION_CONFIG } from './constants'
import { BookEntity } from './entity'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
  ) {}

  async getAll(query: PaginateQuery): Promise<Paginated<BooksResultItem>> {
    console.log('query', query)

    const requestResult = await paginate<BooksResultItemInput>(
      query,
      this.booksRepository,
      PAGINATION_CONFIG,
    )

    return {
      data: requestResult.data.map((item) => booksResultItemSchema.parse(item)),
      meta: requestResult.meta as Paginated<BooksResultItem>['meta'],
      links: requestResult.links,
    }
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
