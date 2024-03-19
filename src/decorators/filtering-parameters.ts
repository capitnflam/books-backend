import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common'
import { Request } from 'express'

// valid filter rules
export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
}

export interface Filtering<Entity> {
  property: keyof Entity
  rule: FilterRule
  value: string
}

interface FilteringParametersInput<Entity> {
  defaultValues?: Filtering<Entity>[]
  allowedProperties: (keyof Entity)[]
}

const filterPatternValue =
  /^\w+:(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):[\w,]+$/
const filterPatternNull = /^\w+:(isnull|isnotnull)$/

const isFilteringRule = (
  rule: string | null | undefined,
): rule is FilterRule => {
  return (
    rule != undefined && Object.values(FilterRule).includes(rule as FilterRule)
  )
}

export const FilteringParametersGenerator = <Entity>() =>
  createParamDecorator(
    (
      { defaultValues, allowedProperties }: FilteringParametersInput<Entity>,
      context: ExecutionContext,
    ): Filtering<Entity>[] | undefined => {
      const request: Request = context.switchToHttp().getRequest()
      let filterArray: string[] = request.query['filter'] as string[]
      const result: Filtering<Entity>[] = []
      if (!request.query['filter']) {
        return defaultValues
      }

      if (!Array.isArray(request.query['filter'])) {
        filterArray = [request.query['filter'] as string]
      }

      for (const filter of filterArray) {
        // validate the format of the filter, if the rule is 'isnull' or 'isnotnull' it don't need to have a value
        if (
          !filterPatternValue.test(filter) &&
          !filterPatternNull.test(filter)
        ) {
          throw new BadRequestException('Invalid filter parameter')
        }

        // extract the parameters and validate if the rule and the property are valid
        const [property, rule, value] = filter.split(':')
        const propertyCast = property as keyof Entity
        if (!allowedProperties.includes(propertyCast)) {
          throw new BadRequestException(`Invalid filter property: ${property}`)
        }
        if (!isFilteringRule(rule)) {
          throw new BadRequestException(`Invalid filter rule: ${rule}`)
        }
        result.push({ property: propertyCast, rule, value: value ?? '' })
      }

      return result
    },
  )
