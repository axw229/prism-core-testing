// @flow
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useRouteMatch, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { CSSTransition } from 'react-transition-group'
import { Grid, AutoSizer } from 'react-virtualized'
import { filterBySection, filterByFamily } from 'src/store/actions/loadColors'
import { type ColorsState, type GridRefState } from 'src/shared/types/Actions.js.flow'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ColorWallContext from './ColorWallContext'
import type { ColorWallContextProps } from './ColorWallContext'
import { getLevelMap, getScrollStep, getCoords, getLongestArrayIn2dArray, getWidthOfWidestChunkRowInChunkGrid, makeChunkGrid, computeFinalScrollPosition, getHeightOfChunkRow, rowHasLabels } from './ColorWallUtils'
import ColorSwatch from './ColorSwatch/ColorSwatch'
import { compareKebabs } from 'src/shared/helpers/StringUtils'
import range from 'lodash/range'
import rangeRight from 'lodash/rangeRight'
import flatten from 'lodash/flatten'
import clamp from 'lodash/clamp'
import take from 'lodash/take'
import { generateColorWallPageUrl, fullColorName } from 'src/shared/helpers/ColorUtils'
import 'src/scss/externalComponentSupport/AutoSizer.scss'
import 'src/scss/convenience/overflow-ellipsis.scss'
import './ColorWall.scss'
// polyfill to make focus-within css class work in IE
import 'focus-within-polyfill'

const WALL_HEIGHT = 475

const ColorWall = () => {
  const { swatchMinSize, swatchMaxSize, swatchSizeZoomed, colorWallBgColor }: ColorWallContextProps = useContext(ColorWallContext)
  const dispatch: { type: string, payload: {} } => void = useDispatch()
  const { url, params }: { url: string, params: { section: ?string, family?: ?string, colorId?: ?string } } = useRouteMatch()
  const history = useHistory()
  const { messages = {} } = useIntl()
  const { items: { colorMap = {}, colorStatuses = {}, sectionLabels = {} }, unChunkedChunks, chunkGridParams, section, family }: ColorsState = useSelector(state => state.colors)

  const [chunkGrid: string[][][][], setChunkGrid: (string[][][][]) => void] = useState([])
  const [containerWidth: number, setContainerWidth: (number) => void] = useState(900)

  const gridRef: GridRefState = useRef()
  const cellRefs: { current: { [string]: HTMLElement } } = useRef({})
  const focusedChunkCoords: { current: ?[number, number] } = useRef()
  const focusedCell: { current: ?string } = useRef()

  const isZoomedIn = !!params.colorId
  const lengthOfLongestChunkRow: number = getLongestArrayIn2dArray(chunkGrid)

  // when chunkGrid resize is enabled
  const swatchSizeUnzoomed: number = chunkGridParams.wrappingEnabled
    ? swatchMaxSize
    : clamp(containerWidth / (getWidthOfWidestChunkRowInChunkGrid(chunkGrid) + lengthOfLongestChunkRow + 1), swatchMinSize, swatchMaxSize)
  const cellSize: number = isZoomedIn ? swatchSizeZoomed : swatchSizeUnzoomed
  const levelMap: { [string]: number } = getLevelMap(chunkGrid, params.colorId)

  // keeps redux store and url in sync for family and section data
  useEffect(() => { params.section && dispatch(filterBySection(params.section)) }, [compareKebabs(params.section, section)])
  useEffect(() => { dispatch(filterByFamily(params.family)) }, [compareKebabs(params.family, family)])

  // build the chunkGrid based on color wall container width
  useEffect(() => {
    if (unChunkedChunks && chunkGridParams) {
      setChunkGrid(makeChunkGrid(unChunkedChunks, chunkGridParams, Math.ceil(containerWidth / swatchSizeUnzoomed)))
    }
  }, [unChunkedChunks, chunkGridParams, containerWidth])

  // initialize a keypress listener
  useEffect(() => {
    const handleKeyDown = e => {
      if (!focusedChunkCoords.current) { return }
      if (e.keyCode >= 37 && e.keyCode <= 40) { e.preventDefault() }

      const [row: number, column: number] = focusedChunkCoords.current
      const chunk = chunkGrid[row][column]
      const [cellRow: number, cellColumn: number] = getCoords(chunk, focusedCell.current)

      ;({
        '9': () => {
          // use default tab behavior when focused on bloomed cell
          if (params.colorId && document.activeElement === cellRefs.current[params.colorId] && !e.shiftKey) { return }

          const nextCoords = (e.shiftKey
            ? rangeRight(column + 1).flatMap((c: number) => rangeRight(0, c === column ? row : chunkGrid.length).map(r => [r, c]))
            : range(column, chunkGrid[row].length).flatMap((c: number) => range(c === column ? row + 1 : 0, chunkGrid.length).map(r => [r, c]))
          ).find(([r, c]) => flatten(chunkGrid[r][c]).some(cell => cell !== undefined))

          if (nextCoords !== undefined) {
            e.preventDefault()
            gridRef.current && gridRef.current.scrollToCell({ rowIndex: nextCoords[0], columnIndex: nextCoords[1] })
            const nextChunk: string[][] = chunkGrid[nextCoords[0]][nextCoords[1]]
            // if bloomed cell exists in newly focused chunk, focus on that. Otherwise focuse on top left cell
            cellRefs.current[params.colorId && getCoords(nextChunk, params.colorId)[0] !== -1 ? params.colorId : nextChunk[0][0]].focus()
          } else {
            focusedChunkCoords.current = null
            focusedCell.current = null
          }
        },
        '13': () => {
          // directly modifing params.colorId instead of calling history.push will make the react-test-renderer not run the useEffect that depends on params.colorId
          focusedCell.current && history.push(generateColorWallPageUrl(params.section, params.family, focusedCell.current, fullColorName(colorMap[focusedCell.current])) + (url.endsWith('family/') ? 'family/' : url.endsWith('search/') ? 'search/' : ''))
        },
        '27': () => { focusedCell.current && history.push(generateColorWallPageUrl(section, family)) },
        '37': () => { cellColumn > 0 && cellRefs.current[chunk[cellRow][cellColumn - 1]].focus() },
        '38': () => { cellRow > 0 && cellRefs.current[chunk[cellRow - 1][cellColumn]].focus() },
        '39': () => { cellColumn < chunk[cellRow].length - 1 && cellRefs.current[chunk[cellRow][cellColumn + 1]].focus() },
        '40': () => { cellRow < chunk.length - 1 && cellRefs.current[chunk[cellRow + 1][cellColumn]].focus() }
      }[e.keyCode] || (() => {}))()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => { window.removeEventListener('keydown', handleKeyDown) }
  }, [chunkGrid])

  // reset refs when the chunkGrid changes
  useEffect(() => {
    cellRefs.current = {}
    focusedChunkCoords.current = null
    focusedCell.current = null
  }, [chunkGrid])

  // recalculate gridSize/cellSize when zooming in/out, changing the chunkGrid, or changing grid width
  useEffect(() => {
    gridRef.current && gridRef.current.recomputeGridSize()
    // forces the scroll position to reset after zooming out (for some reason the scroll position is not updated in firefox)
    gridRef.current && !isZoomedIn && gridRef.current.scrollToPosition({ scrollLeft: 0, scrollTop: 0 })
  }, [isZoomedIn, containerWidth, chunkGrid])

  // start scrolling animation when scroll position changes due to new active color or containerWidth changing
  useEffect(() => {
    if (!params.colorId || !gridRef.current || !chunkGrid || chunkGrid.length === 0) { return }

    // set focus on bloomed swatch
    cellRefs.current[params.colorId] && cellRefs.current[params.colorId].focus()

    const startTime: number = window.performance.now()
    const end = computeFinalScrollPosition(chunkGrid, params.colorId, containerWidth, WALL_HEIGHT, sectionLabels[section])

    ;(function scroll () {
      window.requestAnimationFrame((timestamp: DOMHighResTimeStamp) => {
        gridRef.current.scrollToPosition(getScrollStep(gridRef.current.state, end, timestamp - startTime))
        if (gridRef.current.state.scrollLeft !== end.scrollLeft || gridRef.current.state.scrollTop !== end.scrollTop) {
          scroll()
        }
      })
    })()
  }, [params.colorId, containerWidth, chunkGrid])

  const chunkRenderer = ({ rowIndex: chunkRow, columnIndex: chunkColumn, key, style }) => {
    const chunk: string[][] = chunkGrid[chunkRow][chunkColumn]
    const chunkNum: number = take(chunkGrid, chunkRow).reduce((num, chunkRow) => num + chunkRow.length, 0) + chunkColumn
    const lengthOfLongestRow: number = getLongestArrayIn2dArray(chunk)
    const containsBloomedCell: boolean = getCoords(chunk, params.colorId)[0] !== -1
    const isLargeLabel: boolean = cellSize * lengthOfLongestRow > 120 // magic number breakpoint for choosing between small and large font

    return (flatten(chunk).some(cell => cell !== undefined) &&
      <div key={key} className='color-wall-chunk' style={{ ...style, padding: cellSize / 5, zIndex: containsBloomedCell ? 1 : 'auto' }}>
        {sectionLabels[section] && sectionLabels[section][chunkNum] !== undefined && (
          <div className='color-wall-section-label' style={{ width: style.width - cellSize * 0.4, height: cellSize, marginBottom: isZoomedIn ? 30 : 10 }}>
            <div className={`color-wall-section-label__text ${isLargeLabel ? 'color-wall-section-label__text--large' : ''}`}>
              {sectionLabels[section][chunkNum]}
            </div>
          </div>
        )}
        <Grid
          role='presentation'
          tabIndex={-1}
          className='inner-grid'
          cellRenderer={({ rowIndex, columnIndex, key, style }) => {
            const colorId: string = chunk[rowIndex][columnIndex]
            return (
              <ColorSwatch
                ref={ref => { cellRefs.current[colorId] = ref }}
                onFocus={() => {
                  focusedCell.current = colorId
                  focusedChunkCoords.current = [chunkRow, chunkColumn]
                }}
                key={key}
                style={style}
                color={colorMap[colorId]}
                level={levelMap[colorId]}
                status={colorStatuses[colorId]}
              />
            )
          }}
          width={(lengthOfLongestRow * cellSize)}
          height={chunk.length * cellSize}
          rowCount={chunk.length}
          rowHeight={cellSize}
          columnCount={lengthOfLongestRow}
          columnWidth={cellSize}
        />
      </div>
    )
  }

  return (
    <CSSTransition in={isZoomedIn} timeout={200}>
      <div className='color-wall'>
        {params.colorId && (
          <Link to={generateColorWallPageUrl(section, family)} className='zoom-out-btn' title={messages.ZOOM_OUT}>
            <FontAwesomeIcon icon='search-minus' size='lg' />
          </Link>
        )}
        <AutoSizer disableHeight onResize={({ width }) => setContainerWidth(width)}>
          {({ height = WALL_HEIGHT, width = 900 }) => (
            <Grid
              role='presentation'
              tabIndex={-1}
              ref={gridRef}
              style={{ backgroundColor: colorWallBgColor, padding: cellSize }}
              cellRenderer={chunkRenderer}
              height={height}
              width={width}
              rowCount={chunkGrid ? chunkGrid.length : 0}
              rowHeight={({ index }): number => {
                const hasLabel: boolean = sectionLabels && rowHasLabels(chunkGrid, index, sectionLabels[section])
                return ((getHeightOfChunkRow(chunkGrid[index]) + 0.4) * cellSize) + (hasLabel ? cellSize + (isZoomedIn ? 30 : 10) : 0)
              }}
              columnCount={lengthOfLongestChunkRow}
              columnWidth={({ index }) => cellSize * chunkGrid.map(chunkRow => chunkRow[index]).reduce((w, chunk) => Math.max(w, getLongestArrayIn2dArray(chunk) + 0.4), 0)}
            />
          )}
        </AutoSizer>
      </div>
    </CSSTransition>
  )
}

export default ColorWall
