import { Test, TestingModule } from '@nestjs/testing'

import { AuthorController } from './controller'
import { AuthorService } from './service'

describe('authorController', () => {
  let controller: AuthorController
  const getAll = vi.fn().mockResolvedValue([])
  const get = vi.fn().mockResolvedValue({})

  beforeEach(async () => {
    getAll.mockClear()
    get.mockClear()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        AuthorService,
        {
          provide: AuthorService,
          useValue: {
            getAll,
            get,
          },
        },
      ],
    }).compile()

    controller = module.get<AuthorController>(AuthorController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // TODO: write tests
  it('should return a list of authors', async () => {
    await expect(controller.getAuthors()).resolves.toStrictEqual([])
    expect(getAll).toHaveBeenCalled()
  })
})
