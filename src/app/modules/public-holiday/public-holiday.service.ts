import mongoose from 'mongoose'
import { ResultAsync } from 'neverthrow'
import { PublicHolidayDto } from 'shared/types'

import { createLoggerWithLabel } from '../../config/logger'
import getPublicHolidayModel from '../../models/public_holiday.server.model'
import { getMongoErrorMessage } from '../../utils/handle-mongo-error'
import { DatabaseError } from '../core/core.errors'

const PublicHolidayModel = getPublicHolidayModel(mongoose)
const logger = createLoggerWithLabel(module)

/**
 * Returns all public holidays
 *
 * @param formId the form id to retrieve feedback counts for
 * @returns ok(form feedback count)
 * @returns err(DatabaseError) if database query errors
 */
export const getPublicHolidays = (): ResultAsync<
  PublicHolidayDto[],
  DatabaseError
> => {
  return ResultAsync.fromPromise(PublicHolidayModel.find().exec(), (error) => {
    logger.error({
      message: 'Error retrieving public holiday documents from database',
      meta: {
        action: 'getPublicHolidays',
      },
      error,
    })

    return new DatabaseError(getMongoErrorMessage(error))
  })
}

export const replacePublicHolidays = (
  publicHolidays: PublicHolidayDto[],
): ResultAsync<PublicHolidayDto[], DatabaseError> => {
  return ResultAsync.fromPromise(
    mongoose.startSession().then((session) =>
      session.withTransaction(async () => {
        await PublicHolidayModel.deleteMany()
        await PublicHolidayModel.create(publicHolidays)
      }),
    ),
    (error) => {
      logger.error({
        message: 'Error replacing public holiday documents in database',
        meta: {
          action: 'replacePublicHolidays',
        },
        error,
      })

      return new DatabaseError(getMongoErrorMessage(error))
    },
  )
}
