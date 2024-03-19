import { faker } from '@faker-js/faker'
import { collectionResultSchema } from '@flaminc/books-types'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'

import { addDays } from '../utils'

import { CollectionEntity } from './entity'
import { CollectionService } from './service'

const isbn = faker.commerce.isbn(13)
const synopsis = faker.lorem.sentence()

const testAuthor1Name = 'Test Author 1'

const singleCollectionCreationDate = new Date()
const singleBookCreationDate = new Date()
const singleCollection = {
  createdAt: singleCollectionCreationDate,
  updatedAt: addDays(singleCollectionCreationDate, 1),
  id: 1,
  name: 'Test Collection',
  books: [
    {
      authors: [{ id: 1, name: testAuthor1Name }],
      createdAt: singleBookCreationDate,
      updatedAt: addDays(singleBookCreationDate, 1),
      title: 'Test Book 1',
      id: 1,
      isbn,
      synopsis,
    },
    {
      authors: [
        { id: 1, name: testAuthor1Name },
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
  ],
}

const collectionList = [
  {
    createdAt: singleCollectionCreationDate,
    updatedAt: addDays(singleCollectionCreationDate, 1),
    id: 1,
    name: 'Test Collection',
    books: [
      {
        authors: [{ id: 1, name: testAuthor1Name }],
        createdAt: singleBookCreationDate,
        updatedAt: addDays(singleBookCreationDate, 1),
        title: 'Test Book 1',
        id: 1,
        isbn,
        synopsis,
      },
      {
        authors: [
          { id: 1, name: testAuthor1Name },
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
    ],
  },
  {
    createdAt: singleCollectionCreationDate,
    updatedAt: addDays(singleCollectionCreationDate, 1),
    id: 2,
    name: 'Test Collection 2',
    books: [],
  },
]

class MockRepository extends Repository<CollectionEntity> {
  override find() {
    return Promise.resolve(collectionList as CollectionEntity[])
  }
  override findOne(options: FindOneOptions<CollectionEntity>) {
    if (!Array.isArray(options.where) && options.where?.id === 1) {
      return Promise.resolve(singleCollection as CollectionEntity)
    }
    return Promise.resolve(null)
  }
  override count() {
    return Promise.resolve(collectionList.length)
  }
}

describe('collectionService', () => {
  let service: CollectionService
  let repository: Repository<CollectionEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionService,
        {
          provide: getRepositoryToken(CollectionEntity),
          useClass: MockRepository,
        },
      ],
    }).compile()

    service = module.get<CollectionService>(CollectionService)
    repository = module.get<Repository<CollectionEntity>>(
      getRepositoryToken(CollectionEntity),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return a single collection', async () => {
    const repositorySpy = vi.spyOn(repository, 'findOne')
    await expect(service.get(1)).resolves.toStrictEqual(
      collectionResultSchema.parse(singleCollection),
    )
    expect(repositorySpy).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['books'],
    })
  })

  it('should rejects with a 404 http error if collection is not found', async () => {
    const repositorySpy = vi.spyOn(repository, 'findOne')
    await expect(service.get(404)).rejects.toThrow('Not Found')
    expect(repositorySpy).toHaveBeenCalledWith({
      where: { id: 404 },
      relations: ['books'],
    })
  })

  it('should return a list of collections', async () => {
    const repositorySpy = vi.spyOn(repository, 'find')
    await expect(service.getAll()).resolves.toStrictEqual(
      collectionList.map((data) => collectionResultSchema.parse(data)),
    )
    expect(repositorySpy).toHaveBeenCalled()
  })
})
