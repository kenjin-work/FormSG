import { useCallback, useMemo } from 'react'
import { BiTrash } from 'react-icons/bi'
import { IconButton, Tooltip } from '@chakra-ui/react'

import { useBuilderAndDesignContext } from '../../../BuilderAndDesignContext'
import { useDeleteFormField } from '../../../mutations/useDeleteFormField'
import { useDuplicateFormField } from '../../../mutations/useDuplicateFormField'
import {
  FieldBuilderState,
  setToInactiveSelector,
  stateDataSelector,
  updateEditStateSelector,
  useFieldBuilderStore,
} from '../../../useFieldBuilderStore'

export const DeleteFieldButton = () => {
  const { duplicateFieldMutation } = useDuplicateFormField()
  const { deleteFieldMutation } = useDeleteFormField()
  const isAnyMutationLoading = useMemo(
    () => duplicateFieldMutation.isLoading || deleteFieldMutation.isLoading,
    [duplicateFieldMutation, deleteFieldMutation],
  )

  const { stateData, setToInactive } = useFieldBuilderStore(
    useCallback(
      (state) => ({
        stateData: stateDataSelector(state),
        setToInactive: setToInactiveSelector(state),
        updateEditState: updateEditStateSelector(state),
      }),
      [],
    ),
  )

  const {
    deleteFieldModalDisclosure: { onOpen: onDeleteModalOpen },
  } = useBuilderAndDesignContext()

  const handleDeleteClick = useCallback(() => {
    if (stateData.state === FieldBuilderState.CreatingField) {
      setToInactive()
    } else if (stateData.state === FieldBuilderState.EditingField) {
      onDeleteModalOpen()
    }
  }, [setToInactive, stateData.state, onDeleteModalOpen])
  return (
    <Tooltip label="Delete field">
      <IconButton
        colorScheme="danger"
        aria-label="Delete field"
        icon={<BiTrash fontSize="1.25rem" />}
        onClick={handleDeleteClick}
        isLoading={deleteFieldMutation.isLoading}
        isDisabled={isAnyMutationLoading}
      />
    </Tooltip>
  )
}
