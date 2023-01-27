import React from 'react'
import { Story } from '@storybook/react'
import CircleLoader, { CircleLoaderProps } from './circle-loader'

const Template: Story<CircleLoaderProps> = (args): JSX.Element => {
  return <CircleLoader {...args} />
}

export const Default = Template.bind({})
Default.args = {}

export const LowesVariant = Template.bind({})
LowesVariant.args = { brandId: 'lowes' }

export default {
  title: 'Elements/CircleLoader',
  component: CircleLoader,
  argTypes: {
    brandId: {
      control: { type: 'select' },
      description: '`storybook args only`',
      options: [undefined, 'lowes']
    },
    className: {
      control: false,
      description: 'className to append to svg'
    },
    inheritSize: { control: 'boolean' },
    strokeWidth: { control: { type: 'number', min: 1, max: 50 } }
  }
}
