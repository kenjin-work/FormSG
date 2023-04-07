import { useCallback, useMemo } from 'react'
import { BiDuplicate } from 'react-icons/bi'
import { IconButton, toast, Tooltip } from '@chakra-ui/react'

import { BasicField } from '~shared/types'

import { useToast } from '~hooks/useToast'

import { useDeleteFormField } from '../../../mutations/useDeleteFormField'
import { useDuplicateFormField } from '../../../mutations/useDuplicateFormField'
import { useCreateTabForm } from '../../../useCreateTabForm'
import { FieldBuilderState } from '../../../useFieldBuilderStore'
import { getAttachmentSizeLimit } from '../../../utils/getAttachmentSizeLimit'

export const DuplicateFieldButton = ({ stateData, field }) => {
  console.log('DuplicateFieldButton')
  const toast = useToast({ status: 'danger', isClosable: true })
  const { data: form } = useCreateTabForm()
  const { duplicateFieldMutation } = useDuplicateFormField()
  const { deleteFieldMutation } = useDeleteFormField()

  const isAnyMutationLoading = useMemo(
    () => duplicateFieldMutation.isLoading || deleteFieldMutation.isLoading,
    [duplicateFieldMutation, deleteFieldMutation],
  )

  const handleDuplicateClick = useCallback(() => {
    if (!form) return
    // Duplicate button should be hidden if field is not yet created, but guard here just in case
    if (stateData.state === FieldBuilderState.CreatingField) return
    // Disallow duplicating attachment fields if after the dupe, the filesize exceeds the limit
    if (field.fieldType === BasicField.Attachment) {
      const existingAttachmentsSize = form.form_fields.reduce(
        (sum, ff) =>
          ff.fieldType === BasicField.Attachment
            ? sum + Number(ff.attachmentSize)
            : sum,
        0,
      )
      const remainingAvailableSize =
        getAttachmentSizeLimit(form.responseMode) - existingAttachmentsSize
      const thisAttachmentSize = Number(field.attachmentSize)
      if (thisAttachmentSize > remainingAvailableSize) {
        toast({
          useMarkdown: true,
          description: `The field "${field.title}" could not be duplicated. The attachment size of **${thisAttachmentSize} MB** exceeds the form's remaining available attachment size of **${remainingAvailableSize} MB**.`,
        })
        return
      }
    }
    duplicateFieldMutation.mutate(field._id)
  }, [stateData.state, field, duplicateFieldMutation, form, toast])

  return (
    <Tooltip label="Duplicate field">
      <IconButton
        aria-label="Duplicate field"
        isDisabled={isAnyMutationLoading}
        onClick={handleDuplicateClick}
        isLoading={duplicateFieldMutation.isLoading}
        icon={<BiDuplicate fontSize="1.25rem" />}
      />
    </Tooltip>
  )
}
