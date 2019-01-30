// @flow
import React, { PureComponent } from 'react'
// $FlowIgnore -- no defs for react-virtualized
import { Grid, AutoSizer } from 'react-virtualized'
import { isEqual, isEmpty } from 'lodash'
// $FlowIgnore -- no defs for scroll
import * as scroll from 'scroll'

import { varValues } from 'variables'
import ColorWallSwatch from './ColorWallSwatch/ColorWallSwatch'
import ColorWallSwatchUI from './ColorWallSwatch/ColorWallSwatchUI'
import ColorWallSwatchRenderer from './ColorWallSwatch/ColorWallSwatchRenderer'
import type { ColorMap, Color, ColorGrid, ColorIdGrid, ProbablyColor } from '../../../shared/types/Colors'
import { getColorCoords, drawCircle, getCoordsObjectFromPairs } from './ColorWallUtils'
import { getTotalWidthOf2dArray } from '../../../shared/helpers/DataUtils'

const GRID_AUTOSCROLL_SPEED: number = 300

type Props = {
  colors: ColorGrid, // eslint-disable-line react/no-unused-prop-types
  minCellSize: number,
  maxCellSize: number,
  bloomRadius: number,
  colorMap: ColorMap,
  swatchLinkGenerator: Function,
  swatchDetailsLinkGenerator: Function,
  activeColor?: Color, // eslint-disable-line react/no-unused-prop-types
  showAll?: boolean,
  immediateSelectionOnActivation?: boolean,
  onAddColor?: Function,
  onActivateColor?: Function
}

type ColorReference = {
  level: number,
  compensateX?: Function,
  compensateY?: Function
}

type DerivedStateFromProps = {
  activeCoords: number[],
  focusCoords: number[],
  levelMap: {
    [ key: string ]: ColorReference
  },
  needsInitialFocus: boolean
}
type State = DerivedStateFromProps & {
  colorIdGrid: ColorIdGrid
}

class ColorWallSwatchList extends PureComponent<Props, State> {
  _DOMNode = void (0)
  _scrollTimeout = void (0)
  _scrollInstances = [] // contains references to active scrolls so we can canel them if need be
  // internal tracking of current grid size
  _gridWidth: number = 0
  _gridHeight: number = 0
  // internal tracking of current cell size, varying between min and maxCellSize props
  _cellSize: number

  state: State = {
    needsInitialFocus: true,
    activeCoords: [],
    focusCoords: [],
    levelMap: {},
    colorIdGrid: [[]]
  }

  static defaultProps = {
    bloomRadius: 0,
    minCellSize: 50,
    maxCellSize: 50
  }

  constructor (props: Props) {
    super(props)

    const { colors } = props

    this.addColor = this.addColor.bind(this)
    this.cellRenderer = this.cellRenderer.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleGridResize = this.handleGridResize.bind(this)

    this.state.colorIdGrid = colors.map((moreColors: ProbablyColor[]) => {
      return moreColors.map((color: any) => {
        if (color && color.hasOwnProperty('id')) {
          return color.id
        }
      })
    })

    this._DOMNode = React.createRef()
  }

  static getDerivedStateFromProps (props: Props, state: State) {
    const { bloomRadius, activeColor } = props
    const { colorIdGrid, focusCoords } = state

    let stateChanges = Object.assign({}, state)

    if (!activeColor) {
      return stateChanges
    }

    const coords = getColorCoords(activeColor.id, colorIdGrid)

    if (!isEmpty(focusCoords) && !isEqual(coords, focusCoords)) {
      Object.assign(stateChanges, { needsInitialFocus: false })
    }

    if (coords) {
      Object.assign(stateChanges, {
        activeCoords: coords,
        focusCoords: coords,
        levelMap: drawCircle(bloomRadius, coords[0], coords[1], colorIdGrid)
      })
    }

    return stateChanges
  }

  addColor = function addColor (newColor: Color) {
    const { onAddColor } = this.props

    if (onAddColor) {
      onAddColor(newColor)
    }
  }

  cellRenderer = function cellRenderer ({
    columnIndex, // Horizontal (column) index of cell
    isScrolling, // The Grid is currently being scrolled
    isVisible, // This cell is visible within the grid (eg it is not an overscanned cell)
    key, // Unique key within array of cells
    parent, // Reference to the parent Grid (instance)
    rowIndex, // Vertical (row) index of cell
    style // Style object to be applied to cell (to position it)
  }: Object) {
    const { levelMap, colorIdGrid } = this.state
    const { colorMap, immediateSelectionOnActivation, onAddColor, swatchLinkGenerator, swatchDetailsLinkGenerator } = this.props

    const colorId = colorIdGrid[rowIndex][columnIndex]

    if (!colorId) {
      return null
    }

    const color: Color = colorMap[colorId]
    const thisLevel: ColorReference = levelMap[colorId]
    const linkToSwatch: string = swatchLinkGenerator(color)
    const linkToDetails: string = swatchDetailsLinkGenerator(color)

    let edgeProps = {}

    if (thisLevel) {
      if (thisLevel.compensateX) {
        edgeProps.compensateX = thisLevel.compensateX()
      }

      if (thisLevel.compensateY) {
        edgeProps.compensateY = thisLevel.compensateY()
      }
    }

    return (
      <div key={key} style={style}>
        {thisLevel ? ( // a bloomed swatch
          <ColorWallSwatch showContents={thisLevel.level === 0} thisLink={linkToSwatch} detailsLink={linkToDetails} onAdd={onAddColor ? this.addColor : void (0)} color={color} level={thisLevel.level}
            {...edgeProps} />
        ) : isScrolling ? ( // all non-bloomed swatches when scrolling, the least complicated swatch option
          <ColorWallSwatchRenderer aria-colindex={columnIndex} aria-rowindex={rowIndex} color={color.hex} />
        ) : immediateSelectionOnActivation ? ( // a color swatch that behaves as a button and that's it
          <ColorWallSwatchUI color={color} thisLink={linkToSwatch} {...edgeProps} />
        ) : ( // a normal color swatch that behaves as a button and also is able to be visually activated (not just behave like a button)... a bloomable swatch, basically
          <ColorWallSwatch thisLink={linkToSwatch} detailsLink={linkToDetails} color={color} {...edgeProps} />
        )}
      </div>
    )
  }

  handleKeyDown = function handleKeyDown (e: KeyboardEvent) {
    const { colorIdGrid, focusCoords } = this.state
    const rowCount = colorIdGrid.length
    const columnCount = getTotalWidthOf2dArray(colorIdGrid)

    let x = focusCoords[0]
    let y = focusCoords[1]

    switch (e.keyCode) {
      case 37: // left
        if (x > 0) x--
        break
      case 38: // up
        if (y > 0) y--
        break
      case 39: // right
        if (x < columnCount - 1) x++
        break
      case 40: // down
        if (y < rowCount - 1) y++
        break
    }

    if (x !== focusCoords[0] || y !== focusCoords[1]) {
      this.setState({
        focusCoords: [x, y]
      })
    } else {
      e.preventDefault()
    }
  }

  handleGridResize = function handleGridResize (dims: { width: number, height: number }) {
    this._gridHeight = dims.height
    this._gridWidth = dims.width
  }

  render () {
    const { minCellSize, maxCellSize, showAll, activeColor } = this.props
    const { colorIdGrid, focusCoords, needsInitialFocus } = this.state
    const rowCount = colorIdGrid.length
    const columnCount = getTotalWidthOf2dArray(colorIdGrid)
    let addlGridProps = {}

    if (focusCoords && focusCoords.length && needsInitialFocus) {
      addlGridProps.scrollToColumn = focusCoords[0]
      addlGridProps.scrollToRow = focusCoords[1]
    }

    return (
      <div className={`color-wall-swatch-list ${!showAll ? 'color-wall-swatch-list--zoomed' : 'color-wall-swatch-list--show-all'}`} ref={this._DOMNode}>
        <AutoSizer onResize={this.handleGridResize}>
          {({ height, width }) => {
            let size = maxCellSize

            if (showAll) {
              size = Math.max(Math.min(width / columnCount, maxCellSize), minCellSize)
            }

            // keep tabs on our current size since it can very between min/maxCellSize
            this._cellSize = size

            return (
              <Grid
                _forceUpdateProp={activeColor}
                scrollToAlignment='center'
                cellRenderer={this.cellRenderer}
                columnWidth={size}
                columnCount={columnCount}
                overscanColumnCount={6}
                overscanRowCount={6}
                rowHeight={size}
                rowCount={rowCount}
                width={width}
                height={height}
                overscanIndicesGetter={overscanIndicesGetter}
                {...addlGridProps}
              />
            )
          }}
        </AutoSizer>
      </div>
    )
  }

  componentDidUpdate (prevProps: Props, prevState: State) {
    const { showAll } = this.props
    const { activeCoords, focusCoords } = this.state
    const { activeCoords: oldActiveCoords, focusCoords: oldFocusCoords } = prevState

    if (showAll) {
      return
    }

    let newCoords: ?{x: number, y: number} = getCoordsObjectFromPairs([
      focusCoords,
      activeCoords
    ])

    let oldCoords: ?{x: number, y: number} = getCoordsObjectFromPairs([
      oldFocusCoords,
      oldActiveCoords
    ])

    // if the grid's DOM node exists, AND oldCoords and newCoords both exist, AND they have different values...
    if (this._DOMNode.current && (newCoords && oldCoords && !isEqual(oldCoords, newCoords))) {
      // ... then we can assume at this point that we need to visually scroll the grid to the new focal point
      const gridEl = this._DOMNode.current.querySelector('.ReactVirtualized__Grid')

      if (gridEl) {
        clearTimeout(this._scrollTimeout)

        this._scrollTimeout = setTimeout(() => {
          const scrollToX = newCoords.x * this._cellSize - (this._gridWidth - this._cellSize) / 2
          const scrollToY = newCoords.y * this._cellSize - (this._gridHeight - this._cellSize) / 2

          while (this._scrollInstances.length) {
            this._scrollInstances.pop().call()
          }

          this._scrollInstances = [
            scroll.left(gridEl, scrollToX, { duration: GRID_AUTOSCROLL_SPEED }),
            scroll.top(gridEl, scrollToY, { duration: GRID_AUTOSCROLL_SPEED })
          ]
        }, varValues.colorWall.swatchActivateDelayMS + varValues.colorWall.swatchActivateDurationMS)
      }
    }
  }
}

function overscanIndicesGetter ({
  direction, // One of "horizontal" or "vertical"
  cellCount, // Number of rows or columns in the current axis
  scrollDirection, // 1 (forwards) or -1 (backwards)
  overscanCellsCount, // Maximum number of cells to over-render in either direction
  startIndex, // Begin of range of visible cells
  stopIndex // End of range of visible cells
}) {
  // this is needed to get overscan compensation in both directions at all times
  const overscanStartIndex = Math.max(0, startIndex - overscanCellsCount)
  const overscanStopIndex = Math.min(cellCount - 1, stopIndex + overscanCellsCount)

  return {
    overscanStartIndex: overscanStartIndex,
    overscanStopIndex: overscanStopIndex
  }
}

export default ColorWallSwatchList
