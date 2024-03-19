import { Test, TestingModule } from '@nestjs/testing'

import { CollectionController } from './controller'
import { CollectionService } from './service'

describe('collectionController', () => {
  let controller: CollectionController
  const getAll = vi.fn().mockResolvedValue([])
  const get = vi.fn().mockResolvedValue({})

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionController],
      providers: [
        CollectionService,
        {
          provide: CollectionService,
          useValue: {
            getAll,
            get,
          },
        },
      ],
    }).compile()

    controller = module.get<CollectionController>(CollectionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // TODO: write tests
  it('should return a list of collections', async () => {
    await expect(controller.getCollections()).resolves.toStrictEqual([])
    expect(getAll).toHaveBeenCalled()
  })
})
