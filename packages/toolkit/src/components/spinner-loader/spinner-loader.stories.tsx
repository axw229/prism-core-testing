import React from 'react'
import { Story } from '@storybook/react'
import SpinnerLoader, { SpinnerLoaderProps } from './spinner-loader'

const Template: Story<SpinnerLoaderProps> = (args): JSX.Element => {
  return <SpinnerLoader {...args} />
}

export const Default = Template.bind({})
Default.args = {}

export default {
  title: 'Elements/SpinnerLoader',
  component: SpinnerLoader,
  argTypes: {
    inheritSize: { control: 'boolean' }
  }
}
