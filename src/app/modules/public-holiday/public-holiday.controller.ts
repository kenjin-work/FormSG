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

/**
 * Handler for POST /public-holidays
 * @returns 200 if they were replaced successfully
 * @returns 500 if database error occurs or if the type of error is unknown
 */
export const handleReplacePublicHolidays: ControllerHandler<
  never,
  unknown,
  PublicHolidayDto[]
> = (req, res) => {
  const publicHolidays = req.body
  return PublicHolidayService.replacePublicHolidays(publicHolidays).map(() =>
    res.status(StatusCodes.OK).json(),
  )
}
