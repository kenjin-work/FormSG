import { BiDownload } from 'react-icons/bi'

import { useToast } from '~hooks/useToast'
import Button from '~components/Button'

import {
  getPaymentInvoiceDownloadUrl,
  getPaymentReceiptDownloadUrl,
} from '~features/public-form/utils/urls'

import { GenericMessageBlock } from './GenericMessageBlock'

type DownloadReceiptBlockProps = {
  formId: string
  submissionId: string
  paymentId: string
}

export const DownloadReceiptBlock = ({
  formId,
  submissionId,
  paymentId,
}: DownloadReceiptBlockProps) => {
  const toast = useToast({ status: 'success', isClosable: true })

  const handleReceiptClick = () => {
    toast({
      description: 'Receipt download started',
    })
    window.location.href = getPaymentReceiptDownloadUrl(formId, paymentId)
  }

  const handleInvoiceClick = () => {
    toast({
      description: 'Invoice download started',
    })
    window.location.href = getPaymentInvoiceDownloadUrl(formId, paymentId)
  }
  return (
    <GenericMessageBlock
      title={'Your payment has been made successfully.'}
      subtitle={'Your form has been submitted and payment has been made.'}
      submissionId={submissionId}
    >
      <>
        <Button
          hidden // Currently hidden for JTC
          mt="2.25rem"
          mr="2.25rem"
          leftIcon={<BiDownload fontSize="1.5rem" />}
          onClick={handleReceiptClick}
        >
          Save payment receipt
        </Button>
        <Button
          mt="2.25rem"
          leftIcon={<BiDownload fontSize="1.5rem" />}
          onClick={handleInvoiceClick}
        >
          Save payment invoice
        </Button>
      </>
    </GenericMessageBlock>
  )
}
