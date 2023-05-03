import { chain, left, right } from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import moment from 'moment-timezone'

import { DateSelectedValidation } from '../../../../../shared/types'
import {
  IDateFieldSchema,
  OmitUnusedValidatorProps,
} from '../../../../types/field'
import { ResponseValidator } from '../../../../types/field/utils/validation'
import { ProcessedSingleAnswerResponse } from '../../../modules/submission/submission.types'

import { notEmptySingleAnswerResponse } from './common'

type DateValidator = ResponseValidator<ProcessedSingleAnswerResponse>
type DateValidatorConstructor = (
  dateField: OmitUnusedValidatorProps<IDateFieldSchema>,
) => DateValidator

/**
 * @param date
 * @returns a moment with the date in the format 'DD MMM YYYY'
 */
const createMomentFromDateString = (date: string): moment.Moment => {
  const DATE_FORMAT = 'DD MMM YYYY'

  return moment(date, DATE_FORMAT, true)
}

/**
 * Return a validator to check if date format is correct.
 */
const dateFormatValidator: DateValidator = (response) => {
  const { answer } = response
  return createMomentFromDateString(answer).isValid()
    ? right(response)
    : left(`DateValidator:\t answer is not a valid date`)
}

/**
 * Returns a validator to check if date is in the future.
 */
const pastOnlyValidator: DateValidator = (response) => {
  // Today takes two possible values - a min (in makeFutureOnlyValidator) and max (here)
  // Compares the input time (date casted to midnight in UTC time) with the maximum time
  // for 'today' anywhere in the world (ie 23:59:59 in +14:00 for the current date in +14:00)
  // so respondent can be from any timezone.
  const todayMax = moment().utcOffset('+14:00').endOf('day')
  const { answer } = response
  const answerDate = createMomentFromDateString(answer)

  return answerDate.isAfter(todayMax)
    ? left(`DateValidator:\t answer does not pass date logic validation`)
    : right(response)
}

/**
 * Returns a validator to check if date is in the past.
 */
const futureOnlyValidator: DateValidator = (response) => {
  // Today takes two possible values - a min (here) and max (in makePastOnlyValidator)
  // Compares the input time (date casted to midnight in UTC time) with the minimum time
  // for 'today' anywhere in the world (ie 00:00:00 in -12:00 for the current date in -12:00)
  // so respondent can be from any timezone.
  const todayMin = moment().utcOffset('-12:00').startOf('day')
  const { answer } = response
  const answerDate = createMomentFromDateString(answer)

  return answerDate.isBefore(todayMin)
    ? left(`DateValidator:\t answer does not pass date logic validation`)
    : right(response)
}

/**
 * Returns a validator to check if date is within the
 * specified custom date range.
 */
const makeCustomDateValidator: DateValidatorConstructor =
  (dateField) => (response) => {
    const { answer } = response
    const answerDate = createMomentFromDateString(answer)

    const { customMinDate, customMaxDate } = dateField.dateValidation || {}

    return (customMinDate && answerDate.isBefore(customMinDate)) ||
      (customMaxDate && answerDate.isAfter(customMaxDate))
      ? left(`DateValidator:\t answer does not pass date logic validation`)
      : right(response)
  }

/**
 * Returns the appropriate validator
 * based on the date validation option selected.
 */
const makeDateValidator: DateValidatorConstructor = (dateField) => {
  const { selectedDateValidation } = dateField.dateValidation || {}
  switch (selectedDateValidation) {
    case DateSelectedValidation.NoFuture:
      return pastOnlyValidator
    case DateSelectedValidation.NoPast:
      return futureOnlyValidator
    case DateSelectedValidation.Custom:
      return makeCustomDateValidator(dateField)
    default:
      return right
  }
}

/**
 * Returns a validation function for a date field when called.
 */
export const constructDateValidator: DateValidatorConstructor = (dateField) =>
  flow(
    notEmptySingleAnswerResponse,
    chain(dateFormatValidator),
    chain(makeDateValidator(dateField)),
  )
