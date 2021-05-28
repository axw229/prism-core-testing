// @flow
/** @todo this module should be able to be replaced largely my the single tintable scene
 * and should only need the fastmask specific logic. -RS */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react'
import type { PaintSceneWorkspace } from '../../store/actions/paintScene'
import type { Color } from '../../shared/types/Colors'
import { FormattedMessage } from 'react-intl'
import SimpleTintableScene from './SimpleTintableScene'
import { SCENE_TYPES } from '../../constants/globals'
import useColors from '../../shared/hooks/useColors'
import { useDispatch, useSelector } from 'react-redux'
import ImageQueue from '../MergeCanvas/ImageQueue'
import CircleLoader from '../Loaders/CircleLoader/CircleLoader'
import { setShowEditCustomScene } from '../../store/actions/scenes'
import { useHistory } from 'react-router-dom'
import { SurfaceSelector } from '../SurfaceSelector/SurfaceSelector'
import { ROUTES_ENUM } from './Facets/ColorVisualizerWrapper/routeValueCollections'

import './CustomSceneTinter.scss'

type CustomSceneTinterContainerProps = {
  workspace: PaintSceneWorkspace,
  allowEdit: boolean,
  // A change in wrapper width indicates a resize
  wrapperWidth: number,
  angle: number,
  originalIsPortrait: boolean
}

const customSceneTinterClass = 'custom-scene-tinter'
const customSceneTinterSpinnerClass = `${customSceneTinterClass}__spinner`
const customSceneTinterModalClass = `${customSceneTinterClass}__modal`
const customSceneTinterModalButtonClass = `${customSceneTinterModalClass}__btn`
const customSceneTinterModalTextClass = `${customSceneTinterModalClass}__text`
const customSceneTinterSurfaceSelectorWrapper = `${customSceneTinterClass}__surface-selector`

const CustomSceneTinterContainer = (props: CustomSceneTinterContainerProps) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const showEditModal = useSelector(state => state['showEditCustomScene'])
  const [colors] = useColors()
  const livePaletteColors = useSelector(state => state['lp'])
  const maskImageRef = useRef([])
  const isSavingMask = useSelector(state => state['savingMasks'])
  // @todo get actual value -RS
  // @todo - needed for surface selector comp -RS
  // eslint-disable-next-line no-unused-vars
  const previewRef = useRef()
  const [colorSurfaceMap, setColorSurfaceMap] = useState({})
  // @todo - needed for surface selector comp -RS
  // eslint-disable-next-line no-unused-vars
  const [currentSurfaceIndex, setCurrentSurfaceIndex] = useState(0)
  const { workspace, allowEdit, wrapperWidth, angle, originalIsPortrait } = props

  const [wrapperWidthVal, setWrapperWidthVal] = useState(wrapperWidth)

  // eslint-disable-next-line no-unused-vars
  const { height, width, sceneName, bgImageUrl: background, surfaces } = workspace

  const [imageHeight, setImageHeight] = useState(height)
  const [imageWidth, setImageWidth] = useState(width)

  useEffect(() => {
    dispatch(setShowEditCustomScene(true))
  }, [])

  useEffect(() => {
    console.log(`Width param: ${wrapperWidth} :: Width state: ${wrapperWidthVal}`)
    // calc diff in width change
    const widthDiffPct = wrapperWidth / wrapperWidthVal
    // separate cases for portrait vs vertical images
    let newImageWidth = 0
    let newImageHeight = 0

    if ((originalIsPortrait && (Math.abs(angle) / 90 % 2)) || (!originalIsPortrait && !(Math.abs(angle) / 90 % 2))) {
      // handle og portrait turned on its side
      newImageWidth = wrapperWidth
      newImageHeight = Math.floor(newImageWidth * (height / width))
    } else {
      newImageWidth = Math.floor(imageWidth * widthDiffPct)
      newImageHeight = Math.floor(newImageWidth * (height / width))
    }

    setImageWidth(newImageWidth)
    setImageHeight(newImageHeight)
    setWrapperWidthVal(wrapperWidth)
  }, [wrapperWidth, wrapperWidthVal, imageWidth, angle])

  useEffect(() => {
    if (livePaletteColors) {
      const colorMap = {}
      for (let i = 0; i < props.workspace.layers.length; i++) {
        // This absolutely needs to be rethought after the color selector flow is designed. -RS
        const layerColor = i === 0 ? livePaletteColors.activeColor.id : livePaletteColors.colors[i].id
        colorMap[`${i}`] = layerColor
      }
      setColorSurfaceMap(colorMap)
      console.log('color map', colorMap)
    }
  }, [livePaletteColors])

  useEffect(() => {
    return function () {
      maskImageRef.current.length = 0
    }
  }, [maskImageRef, surfaces])

  const surfaceIds = surfaces.map((surface: string, i: number) => i)
  const handleSurfaceLoaded = (e, i) => {
    maskImageRef.current.push(e.target)
    setImagesLoaded(maskImageRef.current.length)
  }

  const getActiveColorId = (lpColor) => {
    if (lpColor && lpColor.activeColor) {
      return lpColor.activeColor.id
    }

    return null
  }

  const isReadyToTint = (imagesLoaded: number, livePaletteColors?: Color[], surfaces: string[]) => {
    return imagesLoaded && colors && livePaletteColors && livePaletteColors.colors.length && imagesLoaded === surfaces.length
  }

  const hideEditModal = (e: SyntheticEvent) => {
    e.preventDefault()
    dispatch(setShowEditCustomScene(false))
  }

  const editMask = (e: SyntheticEvent) => {
    e.preventDefault()
    dispatch(setShowEditCustomScene(false))
    history.push(ROUTES_ENUM.MASKING)
  }

  return (
    <div>
      <ImageQueue dataUrls={surfaces} addToQueue={handleSurfaceLoaded} />
      <div className={customSceneTinterClass}>
        {isSavingMask ? <div className={customSceneTinterSpinnerClass}><CircleLoader /></div> : null}
        {/* this is the loader that appears when saving a mask */}
        { isReadyToTint(imagesLoaded, livePaletteColors, surfaces)
          ? <SimpleTintableScene
            colors={livePaletteColors.colors}
            activeColorId={getActiveColorId(livePaletteColors)}
            surfaceUrls={surfaces}
            surfaceIds={surfaceIds}
            width={imageWidth}
            allowEdit={allowEdit}
            height={imageHeight}
            sceneName={sceneName}
            sceneType={SCENE_TYPES.ROOM}
            background={background}
            isUsingWorkspace />
          : <CircleLoader />}
        { isReadyToTint(imagesLoaded, livePaletteColors, surfaces) && allowEdit && showEditModal ? <div className={`${customSceneTinterModalClass}`}>
          <div className={customSceneTinterModalTextClass}>
            <FormattedMessage id={'SCENE_TINTER.FEEDBACK_MESSAGE'} />
            <button className={customSceneTinterModalButtonClass} onClick={editMask}>
              <FormattedMessage id={'SCENE_TINTER.FEEDBACK_CONFIRM'} />
            </button>
            <button className={customSceneTinterModalButtonClass} onClick={hideEditModal}>
              <FormattedMessage id={'SCENE_TINTER.FEEDBACK_CANCEL'} />
            </button>
          </div>
        </div> : null }
      </div>
      <div className={customSceneTinterSurfaceSelectorWrapper}>
        { isReadyToTint(imagesLoaded, livePaletteColors, surfaces)
          ? <SurfaceSelector
            workspace={workspace}
            maskRef={maskImageRef}
            lpColors={livePaletteColors.colors}
            colorSurfaceMap={colorSurfaceMap} />
          : null }
      </div>
    </div>
  )
}

export default CustomSceneTinterContainer
