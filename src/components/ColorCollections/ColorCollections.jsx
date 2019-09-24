// @flow
import CollectionDetail from '../shared/CollectionDetail'
import CollectionsHeaderWrapper from '../CollectionsHeaderWrapper/CollectionsHeaderWrapper'
import ColorCollectionsTab from '../shared/ColorCollectionsTab'
import React, { useState, useEffect } from 'react'
import WithConfigurationContext from '../../contexts/ConfigurationContext/WithConfigurationContext'

import { ColorListWithCarousel } from '../Carousel/Carousel'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { loadCollectionSummaries as loadCS } from '../../store/actions/collectionSummaries'
import { loadColors } from '../../store/actions/loadColors'

import './ColorCollections.scss'

type SummaryProps = {
  categories: Object,
  colorMap: Object,
  config: Object,
  intl: Object,
  isShowBack: boolean,
  loadColors: Function,
  loadCS: Function,
  setHeader: Function,
  showBack: Function,
  summaries: {
    data: any[],
    idToIndexHash: any[]
  }
}

type CollectionDataInput = {
  data?: any,
  props: Object,
  tabId: string,
}

const baseClass = 'color-collections'
const wrapper = `${baseClass}__wrapper`
export const collectionsList = `${baseClass}__collections-list`

ColorCollections.collectionData = []

ColorCollections.getSummary = function getSummary (id, props: SummaryProps) {
  const {
    name,
    thumbUrl: img,
    description,
    colorIds
    // ...rest // has a bunch of stuff

  } = props.summaries.data[props.summaries.idToIndexHash[id]]

  return {
    collections: colorIds
      .map(id => props
        .colorMap[id]
      ).filter(collection => collection),
    description,
    img,
    name
  }
}

ColorCollections.getSummariesForTab = function getSummariesForTab (
  tabId, props
) {
  const category = props
    .categories
    .data[props.categories.idToIndexHash[tabId]]

  if (category) {
    return category.summaryIds.reduce(
      (summaries, summaryId) => {
        summaries.push(ColorCollections.getSummary(summaryId, props))
        return summaries
      },
      []
    )
  }

  return []
}

ColorCollections.updateCollectionData = function updateCollectionData ({
  props = {},
  tabId
}: CollectionDataInput) {
  ColorCollections.collectionData = ColorCollections.getSummariesForTab(tabId, props)
}

export function ColorCollections (props: SummaryProps) {
  const [hasColors, setHasColors] = useState(!!Object.keys(props.colorMap).length)

  // TODO:noah.hall
  // wtf do we show while loading?
  // check with cody for loading screen
  const [csLoaded, setCsLoaded] = useState(false)
  useEffect(() => {
    if (!csLoaded) {
      setCsLoaded(true)
      props.loadCS()
    }
  })

  const [colorsRequested, setColorsRequested] = useState(false)
  // load colors if dont exist
  if (!colorsRequested && !hasColors) {
    props.loadColors(props.config.brandId, { language: props.intl.locale })
    setColorsRequested(true)
  }

  const { isShowBack, showBack, setHeader } = props
  const [tabIdShow, showTab] = useState('')
  const [collectionDataDetails, updateCollectionDataDetails] = useState({})

  const showTabHandler = (tabId: string) => {
    showTab((prevTab) => {
      if (prevTab !== tabId) ColorCollections.updateCollectionData({ tabId, props })

      return tabId
    })
  }

  // initial render, selected tab unknown
  // set selected tab
  if (!tabIdShow && props.categories.data.length) {
    showTabHandler(props.categories.data[0].id)
  }
  // subsequent renders, tab known
  // once colors exist, update collection only once
  if (tabIdShow && !hasColors && Object.keys(props.colorMap).length) {
    setHasColors(true)
    ColorCollections.updateCollectionData({ tabId: tabIdShow, props })
  }

  const headerContent = 'Color Collections'

  useEffect(() => {
    if (!isShowBack) {
      setHeader(headerContent)
    }
  }, [isShowBack])

  if (isShowBack === true) {
    return <CollectionDetail collectionDetailData={collectionDataDetails} />
  }

  const onClickHandler = (collectionSummaryData: Object) => {
    showBack()
    setHeader(collectionSummaryData.name)
    updateCollectionDataDetails(collectionSummaryData)
  }

  return (
    <div className={`${wrapper}`}>
      <ColorCollectionsTab
        collectionTabs={props.categories.data}
        showTab={showTabHandler}
        tabIdShow={tabIdShow}
      />
      <div className={`${collectionsList}`}>
        <ColorListWithCarousel
          defaultItemsPerView={8}
          isInfinity={false}
          key={tabIdShow}
          data={ColorCollections.collectionData}
          getSummaryData={onClickHandler}
          isExpertColor={false}
        />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const {
    collectionSummaries: {
      categories,
      summaries
    },
    colors: {
      items: {
        colorMap = {}
      }
    }
  } = state

  return {
    categories,
    summaries,
    colorMap
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    loadCS () { dispatch(loadCS()) },
    loadColors (brandId, opts) { dispatch(loadColors(brandId, opts)) }
  }
}
export default CollectionsHeaderWrapper(connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(WithConfigurationContext(ColorCollections))))
