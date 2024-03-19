import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common'
import { Request } from 'express'

const validDirectionsConst = ['asc', 'desc'] as const
type ValidDirections = (typeof validDirectionsConst)[number]
const validDirections = validDirectionsConst as unknown as string[]

function isDirection(direction: string): direction is ValidDirections {
  return validDirections.includes(direction)
}

export interface Sorting<Entity> {
  property: keyof Entity
  direction: ValidDirections
}

interface SortingParametersInput<Entity> {
  defaultValues?: Sorting<Entity>[]
  allowedProperties: (keyof Entity)[]
}

const sortPattern = /^([\dA-Za-z]+):(asc|desc)$/

export const SortingParametersGenerator = <Entity>() =>
  createParamDecorator<SortingParametersInput<Entity>>(
    (
      { allowedProperties, defaultValues }: SortingParametersInput<Entity>,
      context: ExecutionContext,
    ): Sorting<Entity>[] | undefined => {
      const request: Request = context.switchToHttp().getRequest()
      let sortArray: string[] = request.query['sort'] as string[]
      const result: Sorting<Entity>[] = []
      if (!request.query['sort']) {
        return defaultValues
      }

      if (!Array.isArray(request.query['sort'])) {
        sortArray = [request.query['sort'] as string]
      }

      for (const sort of sortArray) {
        // check the format of the sort query param
        if (!sortPattern.test(sort)) {
          throw new BadRequestException('Invalid sort parameter')
        }
        // extract the property name and direction and check if they are valid
        const [property, direction] = sort.split(':')
        if (!direction || !isDirection(direction)) {
          throw new BadRequestException(
            `Invalid sort direction: ${direction}. Valid directions are: ${validDirections.join(
              ', ',
            )}`,
          )
        }
        const propertyCast = property as keyof Entity
        if (!allowedProperties.includes(propertyCast)) {
          throw new BadRequestException(`Invalid sort property: ${property}`)
        }
        result.push({ property: propertyCast, direction })
      }

      return result
    },
  )
