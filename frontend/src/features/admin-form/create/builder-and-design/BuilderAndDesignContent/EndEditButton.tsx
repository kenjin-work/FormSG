import { useCallback, useMemo } from 'react'

import Button from '~components/Button'

import { useCreatePageSidebar } from '../../common'
import {
  EndPageState,
  setToEditingEndPageSelector,
  stateSelector as endPageStateSelector,
  useEndPageStore,
} from '../../end-page/useEndPageStore'
import { isDirtySelector, useDirtyFieldStore } from '../useDirtyFieldStore'
import {
  setToInactiveSelector,
  useFieldBuilderStore,
} from '../useFieldBuilderStore'

export const EndEditButton = () => {
  const { handleEndpageClick } = useCreatePageSidebar()
  const setToInactive = useFieldBuilderStore(setToInactiveSelector)
  const isDirty = useDirtyFieldStore(isDirtySelector)
  const { endPageState, setEditingEndPageState } = useEndPageStore(
    useCallback(
      (state) => ({
        endPageState: endPageStateSelector(state),
        setEditingEndPageState: setToEditingEndPageSelector(state),
      }),
      [],
    ),
  )

  const isDirtyAndEndPageInactive = useMemo(
    () => isDirty && endPageState === EndPageState.Inactive,
    [endPageState, isDirty],
  )

  const handleEditEndPageClick = useCallback(() => {
    if (isDirtyAndEndPageInactive) {
      return setEditingEndPageState(true)
    }

    setEditingEndPageState()
    setToInactive()
    handleEndpageClick(false)
  }, [
    handleEndpageClick,
    isDirtyAndEndPageInactive,
    setEditingEndPageState,
    setToInactive,
  ])
  return (
    <Button
      _hover={{ bg: 'primary.200' }}
      py="1.5rem"
      width="100%"
      variant="outline"
      borderColor="secondary.200"
      colorScheme="secondary"
      height="auto"
      onClick={handleEditEndPageClick}
      textStyle="subhead-2"
    >
      Customise Thank you page
    </Button>
  )
}
