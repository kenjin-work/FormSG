import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useIsMutating } from 'react-query'
import { Box } from '@chakra-ui/react'

import { FormFieldDto } from '~shared/types/field'

import { adminFormKeys } from '~features/admin-form/common/queries'

import { PENDING_CREATE_FIELD_ID } from '../../constants'
import { isDirtySelector, useDirtyFieldStore } from '../../useDirtyFieldStore'
import {
  FieldBuilderState,
  setToInactiveSelector,
  stateDataSelector,
  updateEditStateSelector,
  useFieldBuilderStore,
} from '../../useFieldBuilderStore'

import { TooltipContent } from './components/TooltipContent'

export interface FieldRowContainerProps {
  field: FormFieldDto
  index: number
  isHiddenByLogic: boolean
  isDraggingOver: boolean
}

export const FieldRowContainer = ({
  field,
  index,
  isHiddenByLogic,
  isDraggingOver,
}: FieldRowContainerProps): JSX.Element => {
  // const numFormFieldMutations = useIsMutating(adminFormKeys.base)
  // const { stateData } = useFieldBuilderStore(
  //   useCallback(
  //     (state) => ({
  //       stateData: stateDataSelector(state),
  //       setToInactive: setToInactiveSelector(state),
  //       updateEditState: updateEditStateSelector(state),
  //     }),
  //     [],
  //   ),
  // )

  // const isDirty = useDirtyFieldStore(isDirtySelector)
  const isActive = false
  // const isActive = useMemo(() => {
  //   if (stateData.state === FieldBuilderState.EditingField) {
  //     return field._id === stateData.field._id
  //   } else if (stateData.state === FieldBuilderState.CreatingField) {
  //     return field._id === PENDING_CREATE_FIELD_ID
  //   }
  //   return false
  // }, [stateData, field])

  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (isActive) {
      ref.current?.scrollIntoView({
        // Avoid sudden jump when field is clicked
        block: 'nearest',
        // Also avoid behavior: 'smooth' as scrolling may take very long
        // on long forms
      })
    }
  }, [isActive])

  const isDragDisabled = false
  // const isDragDisabled = useMemo(() => {
  //   return (
  //     !isActive ||
  //     isDirty ||
  //     !!numFormFieldMutations ||
  //     stateData.state === FieldBuilderState.CreatingField
  //   )
  // }, [isActive, isDirty, numFormFieldMutations, stateData.state])

  return (
    <Draggable
      index={index}
      isDragDisabled={isDragDisabled}
      disableInteractiveElementBlocking
      draggableId={field._id}
    >
      {(provided, snapshot) => {
        console.log('FieldRowContainer')
        return (
          <Box
            _first={{ pt: 0 }}
            _last={{ pb: 0 }}
            py="0.375rem"
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <TooltipContent
              isHiddenByLogic={isHiddenByLogic}
              isDraggingOver={isDraggingOver}
              isDragDisabled={isDragDisabled}
              field={field}
              provided={provided}
              // snapshot={snapshot}
              isActive={isActive}
              isDragging={snapshot.isDragging}
            />
          </Box>
        )
      }}
    </Draggable>
  )
}
