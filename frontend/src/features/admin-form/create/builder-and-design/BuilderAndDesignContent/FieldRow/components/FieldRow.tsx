import { BasicField, FormColorTheme, FormFieldDto } from '~shared/types'

import {
  AttachmentField,
  CheckboxField,
  DateField,
  DecimalField,
  DropdownField,
  EmailField,
  HomeNoField,
  ImageField,
  LongTextField,
  MobileField,
  NricField,
  NumberField,
  ParagraphField,
  RadioField,
  RatingField,
  ShortTextField,
  TableField,
  UenField,
  YesNoField,
} from '~templates/Field'
import { EmailFieldInput } from '~templates/Field/Email'
import { MobileFieldInput } from '~templates/Field/Mobile'

import { SectionFieldRow } from '../SectionFieldRow'
import { VerifiableFieldBuilderContainer } from '../VerifiableFieldBuilderContainer'

type FieldRowProps = {
  field: FormFieldDto
  colorTheme?: FormColorTheme
  showMyInfoBadge?: boolean
}

export const FieldRow = ({ field, ...rest }: FieldRowProps) => {
  switch (field.fieldType) {
    case BasicField.Section:
      return <SectionFieldRow field={field} {...rest} />
    case BasicField.Image:
      return <ImageField schema={field} {...rest} />
    case BasicField.Statement:
      return <ParagraphField schema={field} {...rest} />
    case BasicField.Attachment:
      return <AttachmentField schema={field} {...rest} />
    case BasicField.Checkbox:
      return <CheckboxField schema={field} {...rest} />
    case BasicField.Mobile:
      return field.isVerifiable ? (
        <VerifiableFieldBuilderContainer schema={field} {...rest}>
          <MobileFieldInput schema={field} />
        </VerifiableFieldBuilderContainer>
      ) : (
        <MobileField schema={field} {...rest} />
      )
    case BasicField.HomeNo:
      return <HomeNoField schema={field} {...rest} />
    case BasicField.Email:
      return field.isVerifiable ? (
        <VerifiableFieldBuilderContainer schema={field} {...rest}>
          <EmailFieldInput schema={field} />
        </VerifiableFieldBuilderContainer>
      ) : (
        <EmailField schema={field} {...rest} />
      )
    case BasicField.Nric:
      return <NricField schema={field} {...rest} />
    case BasicField.Number:
      return <NumberField schema={field} {...rest} />
    case BasicField.Decimal:
      return <DecimalField schema={field} {...rest} />
    case BasicField.Date:
      return <DateField schema={field} {...rest} />
    case BasicField.Dropdown:
      return <DropdownField schema={field} {...rest} />
    case BasicField.ShortText:
      return <ShortTextField schema={field} {...rest} />
    case BasicField.LongText:
      return <LongTextField schema={field} {...rest} />
    case BasicField.Radio:
      return <RadioField schema={field} {...rest} />
    case BasicField.Rating:
      return <RatingField schema={field} {...rest} />
    case BasicField.Uen:
      return <UenField schema={field} {...rest} />
    case BasicField.YesNo:
      return <YesNoField schema={field} {...rest} />
    case BasicField.Table:
      return <TableField schema={field} {...rest} />
  }
}
