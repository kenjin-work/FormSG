/**
 * @precondition Must have a parent `react-hook-form#FormProvider` component.
 */
import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { createTextValidationRules } from '~utils/fieldValidation'
import Input from '~components/Input'

import { BaseFieldProps, FieldContainer } from '../FieldContainer'
import { ShortTextFieldSchema, SingleAnswerFieldInput } from '../types'

export interface ShortTextFieldProps extends BaseFieldProps {
  schema: ShortTextFieldSchema
}

export const ShortTextField = ({
  schema,
}: ShortTextFieldProps): JSX.Element => {
  const validationRules = useMemo(
    () => createTextValidationRules(schema),
    [schema],
  )

  const { register } = useFormContext<SingleAnswerFieldInput>()

  return (
    <FieldContainer schema={schema}>
      <Input
        aria-label={schema.title}
        {...register(schema._id, validationRules)}
      />
    </FieldContainer>
  )
}