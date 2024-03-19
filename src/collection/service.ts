import {
  CollectionResult,
  CollectionsResult,
  collectionResultSchema,
  collectionsResultSchema,
} from '@flaminc/books-types'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CollectionEntity } from './entity'

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionEntity)
    private readonly collectionsRepository: Repository<CollectionEntity>,
  ) {}

  async getAll(): Promise<CollectionsResult> {
    const collections = await this.collectionsRepository.find({
      relations: ['books'],
    })

    if (!collections) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }

    return collectionsResultSchema.parse(collections)
  }

  async get(id: number): Promise<CollectionResult> {
    const collection = await this.collectionsRepository.findOne({
      where: { id },
      relations: ['books'],
    })

    if (!collection) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
    return collectionResultSchema.parse(collection)
  }
}
