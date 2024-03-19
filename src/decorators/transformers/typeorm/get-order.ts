import { FindOptionsOrder } from 'typeorm'

import { Sorting } from '../../sorting-parameters'

export function getOrder<Entity>(
  sortArray?: Sorting<Entity>[],
): FindOptionsOrder<Entity> | undefined {
  return sortArray
    ? sortArray.reduce<FindOptionsOrder<Entity>>((accumulator, sort) => {
        return {
          ...accumulator,
          [sort.property]: sort.direction,
        }
      }, {})
    : undefined
}
