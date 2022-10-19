import { Mongoose, QueryCursor, Schema } from 'mongoose'

import { IFormFeedbackModel, IFormFeedbackSchema } from '../../types'

export const FORM_FEEDBACK_SCHEMA_ID = 'FormFeedback'
export const FORM_FEEDBACK_COLLECTION_NAME = 'formfeedback'

const FormFeedbackSchema = new Schema<IFormFeedbackSchema, IFormFeedbackModel>(
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

FormFeedbackSchema.index({
  submissionId: 1,
})

/**
 * Returns a cursor for all feedback for the form with formId.
 * @param formId the form id to return the submissions cursor for
 * @returns a cursor to the feedback retrieved
 */
FormFeedbackSchema.statics.getFeedbackCursorByFormId = function (
  formId: string,
): QueryCursor<IFormFeedbackSchema> {
  return this.find({ formId }).batchSize(2000).read('secondary').lean().cursor()
}

/**
 * Form Feedback Schema
 * @param db Active DB Connection
 * @return Mongoose Model
 */
const getPublicHolidayModel = (db: Mongoose): IFormFeedbackModel => {
  try {
    return db.model<IFormFeedbackSchema, IFormFeedbackModel>(
      FORM_FEEDBACK_SCHEMA_ID,
    )
  } catch {
    return db.model<IFormFeedbackSchema, IFormFeedbackModel>(
      FORM_FEEDBACK_SCHEMA_ID,
      FormFeedbackSchema,
      FORM_FEEDBACK_COLLECTION_NAME,
    )
  }
}

export default getPublicHolidayModel
