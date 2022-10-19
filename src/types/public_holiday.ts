type IPublicHoliday = {
  holiday: string
  date: Date
  created?: Date
  lastModified?: Date
}

export interface IPublicHolidaySchema extends IPublicHoliday, Document {
  created?: Date
  lastModified?: Date
}
