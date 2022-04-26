import { useMemo } from 'react'
import { BiLogInCircle } from 'react-icons/bi'
import { Stack, Text } from '@chakra-ui/react'

import { FormAuthType } from '~shared/types/form'

import Button from '~components/Button'

import { usePublicAuthMutations } from '~features/public-form/mutations'
import { usePublicFormContext } from '~features/public-form/PublicFormContext'

import { AuthImageSvgr } from './AuthImageSvgr'

export interface FormAuthProps {
  authType: Exclude<FormAuthType, FormAuthType.NIL>
}

export const FormAuth = ({ authType }: FormAuthProps): JSX.Element => {
  const { formId } = usePublicFormContext()
  const displayedInfo = useMemo(() => {
    switch (authType) {
      case FormAuthType.SP:
      case FormAuthType.MyInfo:
        return {
          authType: 'Singpass',
          helpText:
            'Sign in with Singpass to access this form.\nYour Singpass ID will be included with your form submission.',
        }
      case FormAuthType.CP:
        return {
          authType: 'Singpass (Corporate)',
          helpText:
            'Corporate entity login is required for this form.\nYour Singpass ID and corporate Entity ID will be included with your form submission.',
        }
      case FormAuthType.SGID:
        return {
          authType: 'Singpass app',
          helpText:
            'Sign in with the Singpass app to access this form.\nYour Singpass ID will be included with your form submission.',
        }
    }
  }, [authType])

  const { handleLoginMutation } = usePublicAuthMutations(formId)

  return (
    <Stack spacing="1.5rem" align="center">
      <AuthImageSvgr />
      <Button
        rightIcon={<BiLogInCircle fontSize="1.5rem" />}
        onClick={() => handleLoginMutation.mutate()}
        isLoading={handleLoginMutation.isLoading}
      >
        Log in with {displayedInfo.authType}
      </Button>
      <Text
        textStyle="body-2"
        color="secondary.500"
        textAlign="center"
        whiteSpace="pre-line"
      >
        {displayedInfo.helpText}
      </Text>
    </Stack>
  )
}