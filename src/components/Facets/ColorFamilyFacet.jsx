// @flow
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ColorWallContext, { colorWallContextDefault } from './ColorWall/ColorWallContext'
import ColorWallRouter from './ColorWall/ColorWallRouter'
import Search from '../Search/Search'
import SearchBar from '../Search/SearchBar'
import ColorWall from './ColorWall/ColorWall'
import facetBinder from 'src/facetSupport/facetBinder'
import { facetBinderDefaultProps, type FacetBinderMethods } from 'src/facetSupport/facetInstance'
import { type FacetPubSubMethods, facetPubSubDefaultProps } from 'src/facetSupport/facetPubSub'

import { ROUTE_PARAMS } from '../../constants/globals'

type Props = FacetBinderMethods & FacetPubSubMethods & {
  colorDetailPageRoot: string,
  colorWallBgColor?: string,
  selectedColorFamily: string
}

const SearchBarNoCancel = () => <SearchBar showCancelButton={false} />

export const ColorFamilyPage = (props: Props) => {
  const { colorDetailPageRoot, colorWallBgColor, selectedColorFamily } = props
  let colorFamilyUrl = 'sherwin-williams-colors/family/red'
  switch (selectedColorFamily) {
    case 'timeless-colors':
    case 'historic-colors':
      colorFamilyUrl = selectedColorFamily
      break

    default:
      colorFamilyUrl = `sherwin-williams-colors/${ROUTE_PARAMS.FAMILY}/${selectedColorFamily}`
  }

  return (
    <ColorWallContext.Provider value={{ ...colorWallContextDefault, colorDetailPageRoot, colorWallBgColor }}>
      <Redirect to={`/${ROUTE_PARAMS.ACTIVE}/${ROUTE_PARAMS.COLOR_WALL}/${ROUTE_PARAMS.SECTION}/${colorFamilyUrl}/${ROUTE_PARAMS.SEARCH}/`} />
      <ColorWallRouter>
        <div className='color-wall-wrap'>
          <Switch>
            <Route path='(.*)?/search/:query' component={SearchBarNoCancel} />
            <Route path='(.*)?/search/' component={SearchBarNoCancel} />
          </Switch>
          <Switch>
            <Route path='(.*)?/family/:family/search/:query' component={Search} />
            <Route path='(.*)?/section/:section/search/:query' component={Search} />
            <Route path='(.*)?/search/:query' component={Search} />
            <Route component={ColorWall} />
          </Switch>
        </div>
      </ColorWallRouter>
    </ColorWallContext.Provider>
  )
}

ColorFamilyPage.defaultProps = {
  ...facetBinderDefaultProps,
  ...facetPubSubDefaultProps
}

export default facetBinder(ColorFamilyPage, 'ColorFamilyFacet')
