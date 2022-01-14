import { useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'

import { FormAuthType } from '~shared/types/form'

import { useToast } from '~hooks/useToast'

import {
  getPublicFormAuthRedirectUrl,
  logoutPublicForm,
} from './PublicFormService'
import { publicFormKeys } from './queries'

export const usePublicAuthMutations = () => {
  const { formId } = useParams()
  if (!formId) throw new Error('No formId provided')
  const queryClient = useQueryClient()

  const toast = useToast({ status: 'success', isClosable: true })

  const handleLoginMutation = useMutation(
    () => getPublicFormAuthRedirectUrl(formId),
    {
      onSuccess: (redirectUrl) => {
        window.location.assign(redirectUrl)
      },
      onError: (error: Error) => {
        toast({
          description: error.message,
          status: 'danger',
        })
      },
    },
  )

  const handleLogoutMutation = useMutation(
    (authType: Exclude<FormAuthType, FormAuthType.NIL>) =>
      logoutPublicForm(authType),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(publicFormKeys.base)
        toast({
          description: 'Logged out successfully',
        })
      },
    },
  )

  return { handleLoginMutation, handleLogoutMutation }
}