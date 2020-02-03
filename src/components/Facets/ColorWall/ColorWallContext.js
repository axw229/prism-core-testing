// @flow
import React from 'react'
import { type GridBounds } from './ColorWall.flow'
import noop from 'lodash/noop'

export type ColorWallA11yContextProps = {
  a11yFocusCell: number[] | void,
  a11yFocusChunk: GridBounds,
  a11yFromKeyboard: boolean,
  a11yFocusOutline: boolean,
  a11yMaintainFocus: boolean
}

export const colorWallA11yContextDefault: ColorWallA11yContextProps = {
  a11yFocusCell: undefined,
  a11yFocusChunk: undefined,
  a11yFromKeyboard: false,
  a11yFocusOutline: false,
  a11yMaintainFocus: false
}

export type ColorWallContextProps = {
  colorDetailPageRoot?: string | typeof undefined,
  colorWallBgColor: string,
  displayAddButton: boolean | typeof undefined,
  displayDetailsLink: boolean | typeof undefined,
  displayInfoButton: boolean | typeof undefined,
  loading: boolean,
  swatchMaxSize: number,
  swatchMaxSizeZoomed: number,
  swatchMinSize: number,
  swatchMinSizeZoomed: number,
  updateA11y: Function
}

export const colorWallContextDefault: ColorWallContextProps = {
  colorDetailPageRoot: undefined,
  colorWallBgColor: '#EEEEEE',
  displayAddButton: false,
  displayDetailsLink: true,
  displayInfoButton: false,
  loading: false,
  swatchMaxSize: 33,
  swatchMaxSizeZoomed: 50,
  swatchMinSize: 14,
  swatchMinSizeZoomed: 50,
  updateA11y: noop
}

const ColorWallContext = React.createContext<Object>({
  ...colorWallA11yContextDefault,
  ...colorWallContextDefault
})

export default ColorWallContext
