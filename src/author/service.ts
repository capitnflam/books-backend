import {
  AuthorResult,
  AuthorsResult,
  authorResultSchema,
  authorsResultSchema,
} from '@flaminc/books-types'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { AuthorEntity } from './entity'

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorsRepository: Repository<AuthorEntity>,
  ) {}

  async getAll(): Promise<AuthorsResult> {
    const authors = await this.authorsRepository.find()

    if (!authors) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }

    return authorsResultSchema.parse(authors)
  }

  async get(id: number): Promise<AuthorResult> {
    const author = await this.authorsRepository.findOne({ where: { id } })

    if (!author) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }

    return authorResultSchema.parse(author)
  }
}
