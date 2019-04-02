/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { Search } from 'src/components/Search/Search'
import * as Colors from '__mocks__/data/color/Colors'

const colors = Colors.getAllColors()

const mockFnLoadSearchResults = jest.fn()
const mockAddToLivePalette = jest.fn()
const mockPreventDefault = jest.fn()
const mockHandleSubmit = jest.fn()
const mockHandleSearchInput = jest.fn()
const mockPersist = jest.fn()

const getSearch = (props) => {
  let defaultProps = {
    colors: [],
    loadSearchResults: mockFnLoadSearchResults,
    addToLivePalette: mockAddToLivePalette
  }

  let newProps = Object.assign({}, defaultProps, props)
  return shallow(<Search {...newProps} />)
}

describe('Search with empty colors prop', () => {
  let search
  beforeEach(() => {
    if (!search) {
      search = getSearch()
    }
  })

  it('should match snapshot', () => {
    expect(search).toMatchSnapshot()
  })

  it('should render form', () => {
    expect(search.find('form').exists()).toBe(true)
  })

  it('should render input', () => {
    expect(search.find('input').exists()).toBe(true)
  })

  it('should have state resultSwatchSize to equal 175', () => {
    expect(search.state('resultSwatchSize')).toEqual(175)
  })
})

describe('Search with colors prop', () => {
  let search
  beforeEach(() => {
    if (!search) {
      search = getSearch({ colors: colors })
    }
  })

  it('should match snapshot', () => {
    expect(search).toMatchSnapshot()
  })
})

describe('Search with events', () => {
  let search
  beforeEach(() => {
    if (!search) {
      search = getSearch()
    }
  })

  it('should call handleInput on input change', () => {
    search.instance().handleSearchInput = mockHandleSearchInput
    search.instance().forceUpdate()
    search.find('input').simulate('input', { target: { value: 'xyz' }, persist: mockPersist })
    expect(mockHandleSearchInput).toHaveBeenCalledWith('xyz')
  })

  it('should call handleSubmit on form submit', () => {
    search.instance().handleSubmit = mockHandleSubmit
    search.instance().forceUpdate()
    search.find('form').simulate('submit', { preventDefault: mockPreventDefault })
    expect(mockHandleSubmit).toHaveBeenCalled()
  })
})