/* eslint-env jest */
import React from 'react'
import { shallow, mount } from 'enzyme'
import { CollectionDetail, collectionCover, triggerPrevious, triggerNext } from 'src/components/Shared/CollectionDetail'
import { getColorCollectionsData, allCollectionsData } from 'src/components/Carousel/data'
import * as Colors from '__mocks__/data/color/Colors'
import { AutoSizer } from 'react-virtualized'
import ColorWallSwatch from '../../../src/components/Facets/ColorWall/ColorWallSwatch/ColorWallSwatch'

const colors = Colors.getAllColors()
const tabIdShow = 'tab1'

let defaultProps = {
  collectionDetailData: getColorCollectionsData(colors, allCollectionsData, tabIdShow)[0],
  addToLivePalette: jest.fn()
}

const getCollectionDetail = (props) => {
  let newProps = Object.assign({}, defaultProps, props)
  return shallow(<CollectionDetail {...newProps} />)
}

describe('CollectionDetail', () => {
  let collectionDetail
  beforeAll(() => {
    if (!collectionDetail) {
      collectionDetail = getCollectionDetail()
    }
  })

  it('should match snapshot', () => {
    expect(collectionDetail).toMatchSnapshot()
  })

  it('should render img with the src as in collectionDetailData', () => {
    expect(collectionDetail.find(`img.${collectionCover}`).exists()).toBe(true)
    expect(collectionDetail.find(`img.${collectionCover}`).prop('src')).toEqual(defaultProps.collectionDetailData.img)
  })

  it('should render previous trigger div', () => {
    expect(collectionDetail.find(`div.${triggerPrevious}`).exists()).toBe(true)
  })

  it('should render next trigger div', () => {
    expect(collectionDetail.find(`div.${triggerNext}`).exists()).toBe(true)
  })
})