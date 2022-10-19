import { StatusCodes } from 'http-status-codes'
import { PublicHolidayDto } from 'shared/types'

import { ControllerHandler } from '../core/core.types'

import * as PublicHolidayService from './public-holiday.service'

/**
 * Handler for GET /public-holidays
 * @returns 200 with list of all public holidays if they were retrieved successfully
 * @returns 500 if database error occurs or if the type of error is unknown
 */
export const handleGetPublicHolidays: ControllerHandler<
  never,
  PublicHolidayDto[]
> = (_req, res) => {
  return PublicHolidayService.getPublicHolidays().map((publicHolidays) =>
    res.status(StatusCodes.OK).json(publicHolidays),
  )
}
