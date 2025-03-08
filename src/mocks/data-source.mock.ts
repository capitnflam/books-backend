import { faker } from '@faker-js/faker'
import { DataSource } from 'typeorm'

import { AuthorEntity } from '../author'
import { BookEntity } from '../book'
import { CollectionEntity } from '../collection'

export async function createDataSourceMock() {
  const dataSource = new DataSource({
    dropSchema: true,
    synchronize: true,
    logging: ['error'],
    entities: [AuthorEntity, BookEntity, CollectionEntity],
    type: 'sqlite',
    database: ':memory:',
  })

  await dataSource.initialize()
  const authorRepo = dataSource.getRepository(AuthorEntity)
  const bookRepo = dataSource.getRepository(BookEntity)
  const collectionRepo = dataSource.getRepository(CollectionEntity)

  const authors = await authorRepo.save([
    authorRepo.create({
      name: 'Test Author 1',
    }),
    authorRepo.create({
      name: 'Test Author 2',
    }),
  ])
  const books = await bookRepo.save([
    bookRepo.create({
      authors: [authors[0]!],
      title: 'Test Book 1',
      isbn: faker.commerce.isbn(13),
      synopsis: faker.lorem.sentence(),
    }),
    bookRepo.create({
      authors: [authors[0]!, authors[1]!],
      title: 'Test Book 2',
      isbn: faker.commerce.isbn(13),
      synopsis: 'Test\n\n\n\nSynopsis',
    }),
    bookRepo.create({
      authors: [authors[1]!],
      title: 'Test Book 3',
      isbn: faker.commerce.isbn(13),
      synopsis: faker.lorem.sentence(),
    }),
  ])
  const collections = await collectionRepo.save([
    collectionRepo.create({
      name: 'Test Collection 1',
      books: [books[0]!, books[1]!, books[2]!],
    }),
    collectionRepo.create({
      name: 'Test Collection 2',
      books: [],
    }),
  ])

  return {
    authorRepo,
    authors,
    bookRepo,
    books,
    collectionRepo,
    collections,
    dataSource,
  }
}
