import { Test, TestingModule } from '@nestjs/testing'

import { BookController } from './controller'
import { BookService } from './service'

describe('bookController', () => {
  let controller: BookController
  const getAll = vi.fn().mockResolvedValue([])
  const get = vi.fn().mockResolvedValue({})

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        BookService,
        {
          provide: BookService,
          useValue: {
            getAll,
            get,
          },
        },
      ],
    }).compile()

    controller = module.get<BookController>(BookController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // TODO: write tests
  it('should return a list of books', async () => {
    await expect(
      controller.getBooks({ limit: 1, page: 1 }),
    ).resolves.toStrictEqual([])
    expect(getAll).toHaveBeenCalled()
  })
})
