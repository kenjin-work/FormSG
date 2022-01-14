import { MemoryRouter, Route } from 'react-router'
import { Routes } from 'react-router-dom'
import { Meta, Story } from '@storybook/react'

import { getAdminFormResponse } from '~/mocks/msw/handlers/admin-form'

import { viewports } from '~utils/storybook'

import { FormBuilderPage } from '~features/admin-form-builder/FormBuilderPage'

import { AdminFormLayout } from './common/AdminFormLayout'

export default {
  title: 'Pages/AdminFormPage/Builder',
  // component: To be implemented,
  decorators: [
    (storyFn) => {
      // MemoryRouter is used so react-router-dom#Link components can work
      // (and also to force the initial tab the page renders to be the settings tab).
      return (
        <MemoryRouter initialEntries={['/12345']}>
          <Routes>
            <Route path={'/:formId'} element={<AdminFormLayout />}>
              <Route index element={storyFn()} />
            </Route>
          </Routes>
        </MemoryRouter>
      )
    },
  ],
  parameters: {
    // Required so skeleton "animation" does not hide content.
    chromatic: { pauseAnimationAtEnd: true },
    layout: 'fullscreen',
    msw: [getAdminFormResponse()],
  },
} as Meta

const Template: Story = () => <FormBuilderPage />
export const Desktop = Template.bind({})

export const Tablet = Template.bind({})
Tablet.parameters = {
  viewport: {
    defaultViewport: 'tablet',
  },
  chromatic: { viewports: [viewports.md] },
}

export const Mobile = Template.bind({})
Mobile.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
  chromatic: { viewports: [viewports.xs] },
}