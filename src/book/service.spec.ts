import { bookResultSchema, booksResultItemSchema } from '@flaminc/books-types'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { createDataSourceMock } from '../mocks/data-source.mock'

import { BookEntity } from './entity'
import { BookService } from './service'

describe('bookService', () => {
  let service: BookService
  let repository: Repository<BookEntity>
  let books: BookEntity[]

  beforeEach(async () => {
    const dataSourceMock = await createDataSourceMock()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(BookEntity),
          useValue: dataSourceMock.bookRepo,
        },
      ],
    }).compile()

    service = module.get<BookService>(BookService)
    repository = dataSourceMock.bookRepo
    books = dataSourceMock.books
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return a single book', async () => {
    const repositorySpy = vi.spyOn(repository, 'findOne')
    await expect(service.get(1)).resolves.toStrictEqual(
      bookResultSchema.parse(books[0]),
    )
    expect(repositorySpy).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { authors: { id: true } },
      relations: ['authors'],
    })
  })

  it('should rejects with a 404 http error if book is not found', async () => {
    const repositorySpy = vi.spyOn(repository, 'findOne')
    await expect(service.get(404)).rejects.toThrow('Not Found')
    expect(repositorySpy).toHaveBeenCalledWith({
      where: { id: 404 },
      select: { authors: { id: true } },
      relations: ['authors'],
    })
  })

  it('should return a list of books', async () => {
    await expect(
      service.getAll({
        path: '/books',
        page: 1,
        limit: 10,
        sortBy: [['title', 'ASC']],
      }),
    ).resolves.toHaveProperty(
      'data',
      books.map((data) => booksResultItemSchema.parse(data)),
    )
  })
})
