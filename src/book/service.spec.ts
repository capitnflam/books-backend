import { faker } from '@faker-js/faker'
import { bookResultSchema, booksResultItemSchema } from '@flaminc/books-types'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'

import { addDays } from '../utils'

import { BookEntity } from './entity'
import { BookService } from './service'

const isbn = faker.commerce.isbn(13)
const synopsis = faker.lorem.sentence()

const singleBookCreationDate = new Date()
const singleBook = {
  authors: [{ id: 1, name: 'Test Author' }],
  createdAt: singleBookCreationDate,
  updatedAt: addDays(singleBookCreationDate, 1),
  title: 'Test Book',
  id: 1,
  isbn,
  synopsis,
}

const bookList = [
  {
    authors: [{ id: 1, name: 'Test Author 1' }],
    createdAt: singleBookCreationDate,
    updatedAt: addDays(singleBookCreationDate, 1),
    title: 'Test Book 1',
    id: 1,
    isbn,
    synopsis,
  },
  {
    authors: [
      { id: 1, name: 'Test Author 1' },
      { id: 2, name: 'Test Author 2' },
    ],
    createdAt: singleBookCreationDate,
    updatedAt: addDays(singleBookCreationDate, 1),
    title: 'Test Book 2',
    id: 2,
    isbn,
    synopsis: 'Test\n\n\n\nSynopsis',
  },
  {
    authors: [{ id: 1, name: 'Test Author' }],
    createdAt: singleBookCreationDate,
    updatedAt: addDays(singleBookCreationDate, 1),
    title: 'Test Book 3',
    id: 3,
    isbn,
    synopsis,
  },
]

class MockRepository extends Repository<BookEntity> {
  override find() {
    return Promise.resolve(bookList as BookEntity[])
  }
  override findOne(options: FindOneOptions<BookEntity>) {
    if (!Array.isArray(options.where) && options.where?.id === 1) {
      return Promise.resolve(singleBook as BookEntity)
    }
    return Promise.resolve(null)
  }
  override count() {
    return Promise.resolve(bookList.length)
  }
}

describe('bookService', () => {
  let service: BookService
  let repository: Repository<BookEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(BookEntity),
          useClass: MockRepository,
        },
      ],
    }).compile()

    service = module.get<BookService>(BookService)
    repository = module.get<Repository<BookEntity>>(
      getRepositoryToken(BookEntity),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return a single book', async () => {
    const repositorySpy = vi.spyOn(repository, 'findOne')
    await expect(service.get(1)).resolves.toStrictEqual(
      bookResultSchema.parse(singleBook),
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
    const repositorySpy = vi.spyOn(repository, 'find')
    await expect(
      service.getAll({ limit: 10, page: 1 }),
    ).resolves.toHaveProperty(
      'items',
      bookList.map((data) => booksResultItemSchema.parse(data)),
    )
    expect(repositorySpy).toHaveBeenCalled()
  })
})
