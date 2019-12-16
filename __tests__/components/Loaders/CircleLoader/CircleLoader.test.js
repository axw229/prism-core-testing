/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import CircleLoader from 'src/components/Loaders/CircleLoader/CircleLoader'

describe('CircleLoader with empty props', () => {
  let circleLoader
  beforeAll(() => {
    circleLoader = mocked(<CircleLoader />)
  })

  it('should match snapshot', () => {
    expect(circleLoader).toMatchSnapshot()
  })

  it('should render svg tag', () => {
    expect(circleLoader.find('svg').exists()).toBe(true)
  })

  it('should render circle tag', () => {
    expect(circleLoader.find('circle').exists()).toBe(true)
  })
})

describe('CircleLoader with props', () => {
  let circleLoader
  beforeAll(() => {
    circleLoader = mocked(<CircleLoader />)
  })

  it('should match snapshot', () => {
    expect(circleLoader).toMatchSnapshot()
  })

  it('should render svg tag with class name: prism-loader-circle', () => {
    expect(circleLoader.find('svg.prism-loader-circle').length).toBe(1)
  })
})
