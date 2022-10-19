import { chain, left, right } from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'

import { CountryRegion } from '../../../../../shared/constants/countryRegion'
import { ResponseValidator } from '../../../../types/field/utils/validation'
import { ProcessedSingleAnswerResponse } from '../../../modules/submission/submission.types'

import { notEmptySingleAnswerResponse } from './common'
import { isOneOfOptions } from './options'

type CountryRegionValidator = ResponseValidator<ProcessedSingleAnswerResponse>
type CountryRegionValidatorConstructor = () => CountryRegionValidator

/**
 * Returns a validation function
 * to check if country/region selection is one of the options.
 */
const makeCountryRegionValidator: CountryRegionValidatorConstructor =
  () => (response) => {
    const validOptions = Object.values(CountryRegion)
    const { answer } = response
    return isOneOfOptions(validOptions, answer)
      ? right(response)
      : left(
          `CountryRegionValidator:\t answer is not a valid country/region option`,
        )
  }

/**
 * Returns a validation function for a country/region field when called.
 */
export const constructCountryRegionValidator: CountryRegionValidatorConstructor =
  () => flow(notEmptySingleAnswerResponse, chain(makeCountryRegionValidator()))