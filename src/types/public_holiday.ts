import { Document, Model } from 'mongoose'

type IPublicHoliday = {
  holiday: string
  date: Date
  created?: Date
  lastModified?: Date
}

export interface IPublicHolidaySchema extends IPublicHoliday, Document {}

export type IPublicHolidayModel = Model<IPublicHolidaySchema>
