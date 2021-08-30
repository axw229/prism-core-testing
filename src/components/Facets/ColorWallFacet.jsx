// @flow
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ColorWallRouter from './ColorWall/ColorWallRouter'
import Search from 'src/components/Search/Search'
import SearchBar from 'src/components/Search/SearchBar'
import ColorWall from './ColorWall/ColorWall'
import ColorWallToolbar from './ColorWall/ColorWallToolbar/ColorWallToolbar'
import facetBinder from 'src/facetSupport/facetBinder'
import ColorWallContext, { colorWallContextDefault } from 'src/components/Facets/ColorWall/ColorWallContext'
import { type FacetPubSubMethods, facetPubSubDefaultProps } from 'src/facetSupport/facetPubSub'
import extendIfDefined from 'src/shared/helpers/extendIfDefined'
import GenericOverlay from 'src/components/Overlays/GenericOverlay/GenericOverlay'
import at from 'lodash/at'
import isArray from 'lodash/isArray'
import useEffectAfterMount from 'src/shared/hooks/useEffectAfterMount'
import { updateColorStatuses } from 'src/store/actions/loadColors'
import { facetBinderDefaultProps, type FacetBinderMethods } from 'src/facetSupport/facetInstance'
import { FormattedMessage } from 'react-intl'
import translateBooleanFlexibly from 'src/shared/utils/translateBooleanFlexibly.util'
import { generateColorWallPageUrl } from 'src/shared/helpers/ColorUtils'
import { setIsColorWallModallyPresented } from '../../store/actions/navigation'

type Props = FacetPubSubMethods & FacetBinderMethods & {
  addButtonText?: string,
  alwaysShowColorFamilies?: boolean,
  colorDetailPageRoot?: string,
  colorWallBgColor?: string,
  displayAddButton?: boolean,
  displayInfoButton?: boolean,
  displayAddButtonText?: boolean,
  displayDetailsLink?: boolean,
  hiddenSections?: string | string[], // as string, "section name 1" or "section name 1|section name 2|etc" will be parsed into an array
  defaultSection?: string
}

export const EVENTS = {
  colorsLoaded: 'PRISM/out/colorsLoaded',
  decorateColors: 'PRISM/in/decorateColors',
  emitColor: 'PRISM/out/emitColor',
  selectedGroup: 'PRISM/out/selectedGroup',
  selectGroup: 'PRISM/in/selectGroup',
  clearSection: 'PRISM/in/clearSection',
  loading: 'PRISM/in/loading'
}

const searchBarNoLabel = () => <div className='color-wall-wrap__chunk'>
  <FormattedMessage id='SEARCH.FIND_A_COLOR'>
    {(label: string) => (
      <SearchBar showCancelButton label={label} showLabel={false} />
    )}
  </FormattedMessage>
</div>

const SearchContain = () => <Search contain />

export const ColorWallPage = (props: Props) => {
  const {
    addButtonText,
    alwaysShowColorFamilies,
    defaultSection,
    displayAddButton = false,
    displayAddButtonText,
    displayInfoButton = false,
    displayDetailsLink = true,
    colorWallBgColor,
    subscribe,
    publish,
    unsubscribeAll,
    colorDetailPageRoot,
    hiddenSections
  } = props
  const dispatch = useDispatch()
  const history = useHistory()

  // -----------------------------------------------------
  // accept and process color decoration from host
  useEffect(() => subscribe(EVENTS.decorateColors, handleColorDecoration), [])
  const handleColorDecoration = useCallback((decoratedColors) => dispatch(updateColorStatuses(decoratedColors)), [])
  const colorMap = useSelector(state => at(state, 'colors.items.colorMap')[0])
  const { section, family } = useSelector(state => at(state, 'colors')[0])
  useEffect(() => { colorMap && publish(EVENTS.colorsLoaded, colorMap) }, [colorMap])

  // -----------------------------------------------------
  // handle emitting selected color to host
  const emitColor = useSelector(state => at(state, 'colors.emitColor')[0])
  // on color select AFTER initial mount
  useEffectAfterMount(() => {
    const color = emitColor && emitColor.color
    if (color) {
      // resetWall(true)
      publish(EVENTS.emitColor, color)
    }
  }, [(emitColor && emitColor.timestamp)])

  useEffect(() => {
    publish(EVENTS.selectedGroup, { family: family, section: section })
  }, [section, family])

  // -----------------------------------------------------
  // handle host demanding appearance of loading
  const [isLoading, updateLoading] = useState(false)
  useEffect(() => {
    subscribe(EVENTS.loading, updateLoading)
    return unsubscribeAll
  }, [])

  // -----------------------------------------------------
  // handle host changing section/family after initial load
  useEffect(() => {
    subscribe(EVENTS.selectGroup, ({ section, family }) => {
      history.push(generateColorWallPageUrl(section, family))
    })
    return unsubscribeAll
  }, [])

  // -----------------------------------------------------
  // handle reseting section/family to defaults
  useEffect(() => {
    subscribe(EVENTS.clearSection, () => {
      history.push(generateColorWallPageUrl(defaultSection))
    })
  }, [])

  // -----------------------------------------------------
  // handle hidden sections
  const processedHiddenSections = useMemo(() => {
    if (typeof hiddenSections === 'string') {
      // hiddenSections is a single pipe-delimited string; break it into an array here before it gets into context
      return hiddenSections.split('|')
    } else if (isArray(hiddenSections)) {
      return hiddenSections
    }

    return []
  }, [ hiddenSections ])

  // -----------------------------------------------------
  // build color wall context and a11y state
  const cwContext = useMemo(() => extendIfDefined({}, colorWallContextDefault, {
    addButtonText,
    colorDetailPageRoot,
    colorWallBgColor,
    displayAddButton: translateBooleanFlexibly(displayAddButton),
    displayInfoButton: translateBooleanFlexibly(displayInfoButton),
    displayAddButtonText: translateBooleanFlexibly(displayAddButtonText),
    displayDetailsLink: translateBooleanFlexibly(displayDetailsLink),
    hiddenSections: processedHiddenSections
  }), [addButtonText, colorDetailPageRoot, colorWallBgColor, displayAddButton, displayAddButtonText, displayDetailsLink])

  // -----------------------------------------------------
  // handle unmounting
  useEffect(() => () => {
    // unsubscribe from everything on unmount
    dispatch(setIsColorWallModallyPresented())
    unsubscribeAll()
  }, [])

  const CWToolbar = (prop) => {
    const [mobileClick, setMobileClick] = useState((prop.location.state) || 'All')
    const [brandClick, setBrandClick] = useState((prop.location.data) || 'All Colors')
    return (
      <div className='color-wall-wrap__chunk'>
        <ColorWallToolbar setMobileClick={setMobileClick} mobileClick={mobileClick} brandClick={brandClick} setBrandClick={setBrandClick} alwaysShowColorFamilies={alwaysShowColorFamilies} />
      </div>
    )
  }

  return (
    <ColorWallContext.Provider value={cwContext}>
      <ColorWallRouter defaultSection={defaultSection}>
        <div className='color-wall-wrap'>
          <nav>
            <Switch>
              <Route path='(.*)?/search/:query' component={searchBarNoLabel} />
              <Route path='(.*)?/search' component={searchBarNoLabel} />
              <Route path='(.*)?/section/:section/family/:family' component={CWToolbar} />
              <Route path='(.*)?/section/:section/family/' component={CWToolbar} />
              <Route path='(.*)?/family/:family/' component={CWToolbar} />
              <Route path='(.*)?/family/' component={CWToolbar} />
              <Route component={CWToolbar} />
            </Switch>
          </nav>
          <Switch>
            <Route path='(.*)?/search/:query' component={SearchContain} />
            <Route path='(.*)?/search/' component={SearchContain} />
            <Route component={ColorWall} />
          </Switch>
          {isLoading ? <GenericOverlay type={GenericOverlay.TYPES.LOADING} semitransparent /> : null}
        </div>
      </ColorWallRouter>
    </ColorWallContext.Provider>
  )
}

ColorWallPage.defaultProps = {
  ...facetPubSubDefaultProps,
  ...facetBinderDefaultProps,
  resetOnUnmount: true
}

export default facetBinder(ColorWallPage, 'ColorWallFacet')
