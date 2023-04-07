import { useCallback, useEffect, useRef } from 'react'
import { BiCog, BiGridHorizontal } from 'react-icons/bi'
import {
  Box,
  ButtonGroup,
  chakra,
  Collapse,
  Fade,
  Flex,
  Icon,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'

import { useIsMobile } from '~hooks/useIsMobile'

import { useCreatePageSidebar } from '~features/admin-form/create/common'

import {
  DesignState,
  setStateSelector,
  useDesignStore,
} from '../../../useDesignStore'
import {
  isDirtySelector,
  useDirtyFieldStore,
} from '../../../useDirtyFieldStore'
import {
  FieldBuilderState,
  setToInactiveSelector,
  stateDataSelector,
  updateEditStateSelector,
  useFieldBuilderStore,
} from '../../../useFieldBuilderStore'

import { DeleteFieldButton } from './DeleteFieldButton'
import { DuplicateFieldButton } from './DuplicateFieldButton'
import { SomeFormProvider } from './SomeFormProvider'

export const TooltipContent = ({
  field,
  isDragging,
  isHiddenByLogic,
  isDraggingOver,
  provided,
  isDragDisabled,
  isActive,
}) => {
  const isMobile = useIsMobile()

  const { stateData, updateEditState } = useFieldBuilderStore(
    useCallback(
      (state) => ({
        stateData: stateDataSelector(state),
        setToInactive: setToInactiveSelector(state),
        updateEditState: updateEditStateSelector(state),
      }),
      [],
    ),
  )

  const isDirty = useDirtyFieldStore(isDirtySelector)

  const setDesignState = useDesignStore(setStateSelector)

  //   const { handleBuilderClick } = useCreatePageSidebar()

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

  const handleFieldClick = useCallback(() => {
    if (isActive) return

    if (isDirty) {
      return updateEditState(field, true)
    }
    updateEditState(field)
    setDesignState(DesignState.Inactive)
    // if (!isMobile) {
    //   // Do not open builder if in mobile so user can view active state without
    //   // drawer blocking the view.
    //   handleBuilderClick(false)
    // }
  }, [
    isDirty,
    isActive,
    updateEditState,
    field,
    setDesignState,
    isMobile,
    // handleBuilderClick,
  ])

  const handleKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleFieldClick()
      }
    },
    [handleFieldClick],
  )

  const handleEditFieldClick = useCallback(() => {
    if (isMobile) {
      //   handleBuilderClick(false)
    }
  }, [
    // handleBuilderClick,
    isMobile,
  ])

  console.log('ToolTipContent')
  return (
    <Tooltip
      hidden={!isHiddenByLogic}
      placement="top"
      label="This field may be hidden by your form logic"
    >
      <Flex
        // Offset for focus boxShadow
        my="2px"
        // Focusable
        tabIndex={0}
        role="button"
        cursor={isActive ? 'initial' : 'pointer'}
        bg="white"
        transition="background 0.2s ease"
        _hover={{ bg: isDraggingOver ? 'white' : 'secondary.100' }}
        borderRadius="4px"
        outline="none"
        {...(isActive ? { 'data-active': true } : {})}
        _focusWithin={{
          boxShadow: isDragging
            ? 'md'
            : '0 0 0 2px var(--chakra-colors-primary-500) !important',
        }}
        _active={{
          bg: 'secondary.100',
          boxShadow: isDragging
            ? 'md'
            : '0 0 0 2px var(--chakra-colors-primary-500)',
        }}
        flexDir="column"
        align="center"
        onClick={handleFieldClick}
        onKeyDown={handleKeydown}
        ref={ref}
      >
        <Fade in={isActive}>
          <chakra.button
            disabled={isDragDisabled}
            display="flex"
            tabIndex={isActive ? 0 : -1}
            {...provided.dragHandleProps}
            borderRadius="4px"
            _disabled={{
              cursor: 'not-allowed',
              opacity: 0.4,
            }}
            _focus={{
              boxShadow: isDragging
                ? undefined
                : '0 0 0 2px var(--chakra-colors-neutral-500)',
            }}
            transition="color 0.2s ease"
            _hover={{
              color: 'secondary.300',
              _disabled: {
                color: 'secondary.200',
              },
            }}
            color={isDragging ? 'secondary.300' : 'secondary.200'}
          >
            {stateData.state === FieldBuilderState.EditingField &&
            !isDragDisabled ? (
              <Icon as={BiGridHorizontal} fontSize="1.5rem" />
            ) : (
              <Box h="1.5rem"></Box>
            )}
          </chakra.button>
        </Fade>
        <SomeFormProvider
          field={field}
          isActive={isActive}
          isHiddenByLogic={isHiddenByLogic}
        />
        <Collapse in={isActive} style={{ width: '100%' }}>
          <Flex
            px={{ base: '0.75rem', md: '1.5rem' }}
            flex={1}
            borderTop="1px solid var(--chakra-colors-neutral-300)"
            justify="flex-end"
          >
            <ButtonGroup variant="clear" colorScheme="secondary" spacing={0}>
              {isMobile ? (
                <IconButton
                  variant="clear"
                  colorScheme="secondary"
                  aria-label="Edit field"
                  icon={<BiCog fontSize="1.25rem" />}
                  onClick={handleEditFieldClick}
                />
              ) : null}
              {
                // Fields which are not yet created cannot be duplicated
                stateData.state !== FieldBuilderState.CreatingField && (
                  <DuplicateFieldButton stateData={stateData} field={field} />
                )
              }
              <DeleteFieldButton />
            </ButtonGroup>
          </Flex>
        </Collapse>
      </Flex>
    </Tooltip>
  )
}
