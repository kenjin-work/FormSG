import { AllowMyInfoBase, FieldBase, FieldResponse } from '../types'

import {
  FormCondition,
  FormDto,
  PreventSubmitLogic,
  FormLogic,
  LogicType,
  ShowFieldLogic,
  LogicConditionState,
} from '../types/form'

export type PickLogicSubset<T extends FormDto = FormDto> = Pick<
  T,
  | '_id'
  | 'form_logics'
  | 'form_fields'
  | 'responseMode'
  | 'form_logics'
  | 'form_fields'
>

export interface ClientField extends AllowMyInfoBase, FieldBase {
  _id?: string
  isVerifiable?: boolean
  fieldValue: string

  getQuestion(): string
}

export type FieldIdSet = Set<string>
export type LogicFieldOrResponse = ClientField | FieldResponse
type GroupedLogic = Record<string, FormCondition[][]>

// Returns typed PreventSubmit logic unit
const isPreventSubmitLogic = (
  formLogic: FormLogic,
): formLogic is PreventSubmitLogic => {
  return formLogic.logicType === LogicType.PreventSubmit
}

// Returns typed ShowFields logic unit
const isShowFieldsLogic = (
  formLogic: FormLogic,
): formLogic is ShowFieldLogic => {
  return formLogic.logicType === LogicType.ShowFields
}

/**
 * Checks if the field ids in logic's conditions all exist in the fieldIds.
 * @param conditions the list of conditions to check
 * @param formFieldIds the set of form field ids to check
 * @returns true if every condition's related form field id exists in the set of formFieldIds, false otherwise.
 */
const allConditionsExist = (
  conditions: FormCondition[],
  formFieldIds: FieldIdSet,
): boolean => {
  return conditions.every((condition) =>
    formFieldIds.has(String(condition.field)),
  )
}

/**
 * Parse logic to get a list of conditions where, if any condition in this list
 * is fulfilled, form submission is prevented.
 * @param form the form document to check
 * @returns array of conditions that prevent submission, can be empty
 */
const getPreventSubmitConditions = (
  form: PickLogicSubset,
): PreventSubmitLogic[] => {
  const formFieldIds = new Set(
    form.form_fields.map((field) => String(field._id)),
  )

  const preventFormLogics =
    form.form_logics?.filter(
      (formLogic): formLogic is PreventSubmitLogic =>
        isPreventSubmitLogic(formLogic) &&
        allConditionsExist(formLogic.conditions, formFieldIds),
    ) ?? []

  return preventFormLogics
}

/**
 * Parse logic into a map of fields that are shown/hidden depending on the
 * values of other fields.
 * Discards invalid logic, where the id in show or conditions do not exist in
 * the form_field.
 *
 * @example
 * Show Email (_id: 1001) and Number (_id: 1002) if Dropdown (_id: 1003) is "Option 1" and Yes_No (_id: 1004) is "Yes"
  Then,
  form_logics: [
    {
      show: ["1001","1002"],
      conditions: [
        {field: "1003", ifValueType: "single-select", state: "is equals to", value: "Option 1"},
        {field: "1004", ifValueType: "single-select", state: "is equals to", value: "Yes"}
       ]
    }
  ]

  logicUnitsGroupedByField:
  {
    "1001": [ [{field: "1003", ifValueType: "single-select", state: "is equals to", value: "Option 1"},
        {field: "1004", ifValueType: "single-select", state: "is equals to", value: "Yes"}] ],
    "1002": [ [{field: "1003", ifValueType: "single-select", state: "is equals to", value: "Option 1"},
        {field: "1004", ifValueType: "single-select", state: "is equals to", value: "Yes"}] ]
  }
 * @caption If "1001" is deleted, "1002" will still be rendered since we just won't add "1001" into logicUnitsGroupedByField
 *
 * @param form the form object to group its logic by field for
 * @returns an object containing fields to be displayed and their corresponding conditions, keyed by id of the displayable field
 */
export const groupLogicUnitsByField = (form: PickLogicSubset): GroupedLogic => {
  const formId = form._id
  const formLogics = form.form_logics.filter(isShowFieldsLogic) ?? []

  const formFieldIds = new Set(
    form.form_fields?.map((field) => String(field._id)),
  )

  /** An index of logic units keyed by the field id to be shown. */
  const logicUnitsGroupedByField: GroupedLogic = {}

  let hasInvalidLogic = false
  formLogics.forEach((logicUnit) => {
    // Only add fields with valid logic conditions to the returned map.
    if (allConditionsExist(logicUnit.conditions, formFieldIds)) {
      logicUnit.show.forEach((fieldId) => {
        fieldId = String(fieldId)
        if (formFieldIds.has(fieldId)) {
          logicUnitsGroupedByField[fieldId] = logicUnitsGroupedByField[fieldId]
            ? logicUnitsGroupedByField[fieldId]
            : []
          logicUnitsGroupedByField[fieldId].push(logicUnit.conditions)
        }
      })
    } else {
      hasInvalidLogic = true
    }
  })
  if (hasInvalidLogic && formId)
    console.info(`formId="${form._id}" message="Form has invalid logic"`)
  return logicUnitsGroupedByField
}

const getCurrentValue = (
  field: LogicFieldOrResponse,
): string | null | undefined | string[] => {
  if ('fieldValue' in field) {
    // client
    return field.fieldValue
  } else if ('answer' in field) {
    // server
    return field.answer
  }
  return null
}

/**
 * Checks if the field's value matches the condition
 * @param {Object} field
 * @param {Object} condition
 * @param {String} condition.state - The type of condition
 */
const isConditionFulfilled = (
  field: LogicFieldOrResponse,
  condition: FormCondition,
): boolean => {
  if (!field || !condition) {
    return false
  }
  let currentValue = getCurrentValue(field)
  if (
    currentValue === null ||
    currentValue === undefined ||
    currentValue.length === 0
  ) {
    return false
  }

  if (
    condition.state === LogicConditionState.Equal ||
    condition.state === LogicConditionState.Either
  ) {
    // condition.value can be a string (is equals to), or an array (is either)
    const conditionValues = ([] as unknown[])
      .concat(condition.value)
      .map(String)
    currentValue = String(currentValue)
    /*
      Handling 'Others' for radiobutton
  
      form_logics: [{ ... value : 'Others' }]
  
      Client-side:
      When an Others radiobutton is checked, the fieldValue is 'radioButtonOthers'
  
      Server-side:
      When an Others radiobutton is checked, and submitted with the required value,
      the answer is: 'Others: value'
      */

    // TODO: An option that is named "Others: Something..." will also pass this test,
    // even if the field has not been configured to set othersRadioButton=true
    if (conditionValues.indexOf('Others') > -1) {
      if (field.fieldType === 'radiobutton') {
        conditionValues.push('radioButtonOthers')
      } else if (field.fieldType === 'checkbox') {
        conditionValues.push('checkboxOthers') // Checkbox currently doesn't have logic, but the 'Others' will work in the future if it in implemented
      }
      return (
        conditionValues.indexOf(currentValue) > -1 || // Client-side
        currentValue.startsWith('Others: ')
      ) // Server-side
    }
    return conditionValues.indexOf(currentValue) > -1
  } else if (condition.state === 'is less than or equal to') {
    return Number(currentValue) <= Number(condition.value)
  } else if (condition.state === 'is more than or equal to') {
    return Number(currentValue) >= Number(condition.value)
  } else {
    return false
  }
}

/**
 * Find the field in the current submission corresponding to the condition to be
 * checked.
 * @param submission the submission responses to retrieve logic units for. Can be `form_fields` (on client), or `req.body.responses` (on server)
 * @param fieldId the id of condition field to find
 * @returns the condition field if it exists, `undefined` otherwise
 */
const findConditionField = (
  submission: LogicFieldOrResponse[],
  fieldId: any,
): LogicFieldOrResponse | undefined => {
  return submission.find(
    (submittedField) => String(submittedField._id) === String(fieldId),
  )
}

/**
 * Checks if an array of conditions is satisfied.
 * @param submission the submission responses to retrieve logic units for. Can be `form_fields` (on client), or `req.body.responses` (on server)
 * @param logicUnit an object containing the conditions specified in a single modal of `add new logic` on the form logic tab
 * @param visibleFieldIds the set of field IDs that are visible, which is used to ensure that conditions are visible
 * @returns true if all the conditions are satisfied, false otherwise
 */
const isLogicUnitSatisfied = (
  submission: LogicFieldOrResponse[],
  logicUnit: FormCondition[],
  visibleFieldIds: FieldIdSet,
): boolean => {
  return logicUnit.every((condition) => {
    const conditionField = findConditionField(submission, condition.field)
    return (
      conditionField?._id &&
      visibleFieldIds.has(conditionField._id.toString()) &&
      isConditionFulfilled(conditionField, condition)
    )
  })
}

/**
 * Determines whether the submission should be prevented by form logic. If so,
 * return the condition preventing the submission. If not, return undefined.
 * @param submission the submission responses to retrieve logic units for. Can be `form_fields` (on client), or `req.body.responses` (on server)
 * @param form the form document for the submission
 * @param optionalVisibleFieldIds the optional set of currently visible fields. If this is not provided, it will be recomputed using the given form parameter.
 * @returns a condition if submission is to prevented, otherwise `undefined`
 */
export const getLogicUnitPreventingSubmit = (
  submission: LogicFieldOrResponse[],
  form: PickLogicSubset,
  visibleFieldIds?: FieldIdSet,
): PreventSubmitLogic | undefined => {
  const definedVisibleFieldIds =
    visibleFieldIds ?? getVisibleFieldIds(submission, form)
  const preventSubmitConditions = getPreventSubmitConditions(form)
  return preventSubmitConditions.find((logicUnit) =>
    isLogicUnitSatisfied(
      submission,
      logicUnit.conditions,
      definedVisibleFieldIds,
    ),
  )
}

/**
 * Gets the IDs of visible fields in a form according to its responses.
 * This function loops through all the form fields until the set of visible
 * fields no longer changes. The first loop adds all the fields with no
 * conditions attached, the second adds fields which are made visible due to fields added in the previous loop, and so on.
 * @param submission the submission responses to retrieve logic units for. Can be `form_fields` (on client), or `req.body.responses` (on server)
 * @param form the form document for the submission
 * @returns a set of IDs of visible fields in the submission
 */
export const getVisibleFieldIds = (
  submission: LogicFieldOrResponse[],
  form: PickLogicSubset,
): FieldIdSet => {
  const logicUnitsGroupedByField = groupLogicUnitsByField(form)
  const visibleFieldIds: FieldIdSet = new Set()
  // Loop continues until no more changes made
  let changesMade = true
  while (changesMade) {
    changesMade = false
    form.form_fields.forEach((field) => {
      const logicUnits = logicUnitsGroupedByField[String(field._id)]
      // If a field's visibility does not have any conditions, it is always
      // visible.
      // Otherwise, a field's visibility can be toggled by a combination of
      // conditions.
      // Eg. the following are logicUnits - just one of them has to be satisfied
      // 1) Show X if Y=yes and Z=yes
      // Or
      // 2) Show X if A=1
      if (
        !visibleFieldIds.has(field._id.toString()) &&
        (!logicUnits ||
          logicUnits.some((logicUnit) =>
            isLogicUnitSatisfied(submission, logicUnit, visibleFieldIds),
          ))
      ) {
        visibleFieldIds.add(field._id.toString())
        changesMade = true
      }
    })
  }
  return visibleFieldIds
}