import { useCallback, useMemo } from 'react'
import {
  Box,
  ButtonProps,
  Center,
  chakra,
  forwardRef,
  Icon,
  Text,
} from '@chakra-ui/react'

import { BxsWidget } from '~assets/icons/BxsWidget'
import { useIsMobile } from '~hooks/useIsMobile'

import { useCreatePageSidebar } from '~features/admin-form/create/common'

interface EmptyFormPlaceholderProps extends ButtonProps {
  isDraggingOver: boolean
}

export const EmptyFormPlaceholder = forwardRef<
  EmptyFormPlaceholderProps,
  'button'
>(({ isDraggingOver, ...props }, ref): JSX.Element => {
  const isMobile = useIsMobile()
  const { handleBuilderClick } = useCreatePageSidebar()
  const handlePlaceholderClick = useCallback(
    () => handleBuilderClick(false),
    [handleBuilderClick],
  )
  const onClick = handlePlaceholderClick

  const placeholderText = useMemo(() => {
    if (isDraggingOver) {
      return 'Drop your field here'
    }
    return isMobile
      ? 'Tap here to add a field'
      : 'Drag a field from the Builder on the left to start'
  }, [isDraggingOver, isMobile])

  return (
    <Box h="13.75rem" m={{ base: 0, lg: '1.625rem' }}>
      <chakra.button
        _hover={{
          bg: 'primary.200',
        }}
        _focus={{
          boxShadow: '0 0 0 2px var(--chakra-colors-neutral-500)',
        }}
        h="100%"
        w="100%"
        border="1px dashed"
        borderColor={isDraggingOver ? 'primary.700' : 'secondary.300'}
        borderRadius="4px"
        bg="neutral.100"
        transitionProperty="common"
        transitionDuration="normal"
        onClick={onClick}
        {...props}
        ref={ref}
      >
        <Center flexDir="column" gap={'0.75rem'}>
          <Icon
            as={BxsWidget}
            __css={{ color: 'secondary.500', fontSize: '1.5rem' }}
          />
          <Text
            textStyle="subhead-2"
            color="secondary.500"
            px="1.5rem"
            textAlign={'center'}
          >
            {placeholderText}
          </Text>
        </Center>
      </chakra.button>
    </Box>
  )
})
