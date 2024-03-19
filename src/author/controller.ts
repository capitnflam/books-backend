import { Controller, Get, Header, Param } from '@nestjs/common'

import { http } from '../constants/http'

import { AuthorService } from './service'

@Controller('authors?')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  @Header(http.headers.CONTENT_TYPE, http.mime.APPLICATION_JSON)
  getAuthors() {
    return this.authorService.getAll()
  }

  @Get(':id')
  @Header(http.headers.CONTENT_TYPE, http.mime.APPLICATION_JSON)
  getAuthor(@Param('id') id: string) {
    return this.authorService.get(Number.parseInt(id))
  }
}
