import { Box, Text } from '@chakra-ui/react'

import Menu, { MenuButtonProps } from '~components/Menu'

import { SortOption } from '~features/workspace/types'

export interface WorkspaceSortDropdownProps
  extends Omit<MenuButtonProps, 'onChange'> {
  isDisabled?: boolean
  value: SortOption
  onChange: (option: SortOption) => void
}

export const WorkspaceSortDropdown = ({
  isDisabled,
  value,
  onChange,
  ...buttonProps
}: WorkspaceSortDropdownProps): JSX.Element => {
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <Box>
            <Menu.Button
              isDisabled={isDisabled}
              w="100%"
              minW="8rem"
              variant="outline"
              colorScheme="secondary"
              isActive={isOpen}
              {...buttonProps}
            >
              {value}
            </Menu.Button>
          </Box>
          <Menu.List defaultValue={value}>
            {Object.values(SortOption).map((option) => (
              <Menu.Item key={option} onClick={() => onChange(option)}>
                <Text
                  // Styling to hint to user the current active choice
                  fontWeight={option === value ? 500 : 400}
                >
                  {option}
                </Text>
              </Menu.Item>
            ))}
          </Menu.List>
        </>
      )}
    </Menu>
  )
}