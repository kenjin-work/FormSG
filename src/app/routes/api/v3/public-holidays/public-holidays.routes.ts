import { Router } from 'express'

import * as PublicHolidayController from '../../../../modules/public-holiday/public-holiday.controller'

export const PublicHolidaysRouter = Router()

PublicHolidaysRouter.get('/', PublicHolidayController.handleGetPublicHolidays)
PublicHolidaysRouter.post(
  '/',
  PublicHolidayController.handleReplacePublicHolidays,
)
