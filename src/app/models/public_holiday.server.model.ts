import { Mongoose, Schema } from 'mongoose'

import { IPublicHolidayModel, IPublicHolidaySchema } from '../../types'

export const PUBLIC_HOLIDAY_SCHEMA_ID = 'PublicHolidays'
export const PUBLIC_HOLIDAY_COLLECTION_NAME = 'publicHolidays'

const PublicHolidaySchema = new Schema<
  IPublicHolidaySchema,
  IPublicHolidayModel
>(
  {
    holiday: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'lastModified',
    },
  },
)

/**
 * Public Holiday Schema
 * @param db Active DB Connection
 * @return Mongoose Model
 */
const getPublicHolidayModel = (db: Mongoose): IPublicHolidayModel => {
  try {
    return db.model<IPublicHolidaySchema, IPublicHolidayModel>(
      PUBLIC_HOLIDAY_SCHEMA_ID,
    )
  } catch {
    return db.model<IPublicHolidaySchema, IPublicHolidayModel>(
      PUBLIC_HOLIDAY_SCHEMA_ID,
      PublicHolidaySchema,
      PUBLIC_HOLIDAY_COLLECTION_NAME,
    )
  }
}

export default getPublicHolidayModel
