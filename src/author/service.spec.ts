import { authorResultSchema } from '@flaminc/books-types'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { FindOneOptions, Repository } from 'typeorm'

import { addDays } from '../utils'

import { AuthorEntity } from './entity'
import { AuthorService } from './service'

const singleAuthorCreationDate = new Date()
const singleAuthor = {
  createdAt: singleAuthorCreationDate,
  updatedAt: addDays(singleAuthorCreationDate, 1),
  id: 1,
  name: 'Test Author',
}

const authorList = [
  {
    createdAt: singleAuthorCreationDate,
    updatedAt: addDays(singleAuthorCreationDate, 1),
    id: 1,
    name: 'Test Author 1',
  },
  {
    createdAt: singleAuthorCreationDate,
    updatedAt: addDays(singleAuthorCreationDate, 1),
    id: 2,
    name: 'Test Author 2',
  },
]

class MockRepository extends Repository<AuthorEntity> {
  override find() {
    return Promise.resolve(authorList as AuthorEntity[])
  }
  override findOne(options: FindOneOptions<AuthorEntity>) {
    if (!Array.isArray(options.where) && options.where?.id === 1) {
      return Promise.resolve(singleAuthor as AuthorEntity)
    }
    return Promise.resolve(null)
  }
  override count() {
    return Promise.resolve(authorList.length)
  }
}

describe('authorService', () => {
  let service: AuthorService
  let repository: Repository<AuthorEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: getRepositoryToken(AuthorEntity),
          useClass: MockRepository,
        },
      ],
    }).compile()

    service = module.get<AuthorService>(AuthorService)
    repository = module.get<Repository<AuthorEntity>>(
      getRepositoryToken(AuthorEntity),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return a single author', async () => {
    const repositorySpy = vi.spyOn(repository, 'findOne')
    await expect(service.get(1)).resolves.toStrictEqual(
      authorResultSchema.parse(singleAuthor),
    )
    expect(repositorySpy).toHaveBeenCalledWith({
      where: { id: 1 },
    })
  })

  it('should rejects with a 404 http error if author is not found', async () => {
    const repositorySpy = vi.spyOn(repository, 'findOne')
    await expect(service.get(404)).rejects.toThrow('Not Found')
    expect(repositorySpy).toHaveBeenCalledWith({
      where: { id: 404 },
    })
  })

  it('should return a list of authors', async () => {
    const repositorySpy = vi.spyOn(repository, 'find')
    await expect(service.getAll()).resolves.toStrictEqual(
      authorList.map((data) => authorResultSchema.parse(data)),
    )
    expect(repositorySpy).toHaveBeenCalled()
  })
})
