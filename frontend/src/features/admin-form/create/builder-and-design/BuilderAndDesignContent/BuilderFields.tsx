import React from 'react'
import { Virtuoso } from 'react-virtuoso'

import { AdminFormDto } from '~shared/types/form'

import { FormFieldWithQuestionNo } from '~features/form/types'
import { augmentWithQuestionNo } from '~features/form/utils'
import { FieldIdSet } from '~features/logic/types'

import FieldRow from './FieldRow'

interface BuilderFieldsProps {
  fields: AdminFormDto['form_fields']
  visibleFieldIds: FieldIdSet
  isDraggingOver: boolean
}

export class BuilderFields extends React.Component<BuilderFieldsProps> {
  // shouldComponentUpdate(
  //   nextProps: Readonly<BuilderFieldsProps>,
  //   nextState: Readonly<BuilderFieldsProps>,
  //   nextContext: any,
  // ): boolean {
  //   return false
  // }

  getRowRenderer =
    (fieldsWithQuestionNos: FormFieldWithQuestionNo[]) => (index: number) => {
      const { visibleFieldIds, isDraggingOver } = this.props
      const f = fieldsWithQuestionNos[index]
      console.log('dsa')
      return (
        <FieldRow
          index={index}
          key={f._id}
          field={f}
          isHiddenByLogic={!visibleFieldIds.has(f._id)}
          isDraggingOver={isDraggingOver}
        />
      )
    }

  render() {
    const { fields, visibleFieldIds, isDraggingOver } = this.props
    const fieldsWithQuestionNos = augmentWithQuestionNo(fields).map((f, i) => {
      console.log('FieldRow')
      return (
        <FieldRow
          index={i}
          key={f._id}
          field={f}
          isHiddenByLogic={!visibleFieldIds.has(f._id)}
          isDraggingOver={isDraggingOver}
        />
      )
    })

    return (
      <>{fieldsWithQuestionNos}</>
      // <Virtuoso
      //   style={{ height: '10000vh' }}
      //   totalCount={this.props.fields.length}
      //   itemContent={this.getRowRenderer(augmentWithQuestionNo(fields))}
      // />
    )
  }
}
// export const BuilderFields = ({
//   fields,
//   visibleFieldIds,
//   isDraggingOver,
// }: BuilderFieldsProps): JSX.Element => {}
