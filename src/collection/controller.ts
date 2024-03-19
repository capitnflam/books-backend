import { Controller, Get, Header, Param } from '@nestjs/common'

import { http } from '../constants/http'

import { CollectionService } from './service'

@Controller('collections?')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  @Header(http.headers.CONTENT_TYPE, http.mime.APPLICATION_JSON)
  getCollections() {
    return this.collectionService.getAll()
  }

  @Get(':id')
  @Header(http.headers.CONTENT_TYPE, http.mime.APPLICATION_JSON)
  getCollection(@Param('id') id: string) {
    return this.collectionService.get(Number.parseInt(id))
  }
}
