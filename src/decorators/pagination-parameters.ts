import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common'
import { Request } from 'express'

export interface Pagination {
  page: number
  limit: number
}

interface PaginationParametersInput {
  defaultValues?: Pagination
  maxLimit?: number
}

export const PaginationParameters = createParamDecorator(
  (
    {
      defaultValues = { limit: 10, page: 1 },
      maxLimit = 100,
    }: PaginationParametersInput,
    context: ExecutionContext,
  ): Pagination => {
    const request: Request = context.switchToHttp().getRequest()
    let page = defaultValues.page
    let limit = defaultValues.limit

    try {
      page = Number.parseInt(request.query['page'] as string)
    } catch {
      page = defaultValues.page
    }

    try {
      limit = Number.parseInt(request.query['limit'] as string)
    } catch {
      limit = defaultValues.limit
    }

    // check if page and size are valid
    if (Number.isNaN(page) || page < 0 || Number.isNaN(limit) || limit < 0) {
      throw new BadRequestException('Invalid pagination parameters')
    }
    // do not allow to fetch large slices of the dataset
    if (limit > maxLimit) {
      throw new BadRequestException(
        `Invalid pagination parameters: Max limit is ${maxLimit}`,
      )
    }

    return { page, limit }
  },
)
