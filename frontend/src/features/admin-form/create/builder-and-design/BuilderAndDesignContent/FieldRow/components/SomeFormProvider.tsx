import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Box } from '@chakra-ui/react'
import { times } from 'lodash'

import { BasicField, FormFieldDto } from '~shared/types'

import { createTableRow } from '~templates/Field/Table/utils/createRow'

import {
  augmentWithMyInfoDisplayValue,
  extractPreviewValue,
  hasExistingFieldValue,
  isMyInfo,
} from '~features/myinfo/utils'

import { useDesignColorTheme } from '../../../utils/useDesignColorTheme'

import { FieldRow } from './FieldRow'

export const SomeFormProvider = ({ field, isActive, isHiddenByLogic }) => {
  const colorTheme = useDesignColorTheme()

  const isMyInfoField = useMemo(() => isMyInfo(field), [field])

  const defaultFieldValues = useMemo(() => {
    if (field.fieldType === BasicField.Table) {
      return {
        [field._id]: times(field.minimumRows || 0, () => createTableRow(field)),
      }
    }

    const augmentedField = augmentWithMyInfoDisplayValue(field)

    if (hasExistingFieldValue(augmentedField)) {
      return {
        [field._id]: extractPreviewValue(augmentedField),
      }
    }
  }, [field])

  const formMethods = useForm<FormFieldDto>({
    mode: 'onChange',
    defaultValues: defaultFieldValues,
  })
  console.log('SomeFormProvider')
  return (
    <Box
      px={{ base: '0.75rem', md: '1.5rem' }}
      pb={{ base: '0.75rem', md: '1.5rem' }}
      w="100%"
      pointerEvents={isActive ? undefined : 'none'}
      opacity={isActive || !isHiddenByLogic ? '100%' : '30%'}
    >
      <FormProvider {...formMethods}>
        <FieldRow
          field={field}
          colorTheme={colorTheme}
          showMyInfoBadge={isMyInfoField}
        />
      </FormProvider>
    </Box>
  )
}
