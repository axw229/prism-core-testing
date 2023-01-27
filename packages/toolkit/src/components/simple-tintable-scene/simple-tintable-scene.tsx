import React, { useRef, useState } from 'react'
import { LiveMessage } from 'react-aria-live'
import { TransitionGroup } from 'react-transition-group'
import uniqueId from 'lodash/uniqueId'
import type { Color, MiniColor } from '../../types'
import { getFilterId, getMaskId } from '../../utils/tintable-scene'
import GenericOverlay from '../generic-overlay/generic-overlay'
import InlineStyleTransition from '../inline-style-transition/inline-style-transition'
import SimpleTintableSceneHitArea from './simple-tintable-scene-hit-area'
import TintableSceneSurface from './tintable-scene-surface'
import TintableSceneSVGDefs from './tintable-scene-svg-defs'

export interface SimpleTintableSceneProps {
  sceneType: string
  sceneName: string
  background: string
  surfaceUrls: Array<string | null>
  surfaceIds: Array<number | null>
  surfaceHitAreas?: Array<string | null>
  highlights?: Array<string | null>
  shadows?: Array<string | null>
  width: number
  height: number
  imageValueCurve?: string
  interactive?: boolean
  handleSurfaceInteraction?: (surfaceIndex: number) => void
  // This is a sparse array
  surfaceColors?: Array<Color | MiniColor | null>
  adjustSvgHeight?: boolean
}

export const TEST_ID = {
  SURFACES_CONTAINER: 'SURFACES_CONTAINER',
  HIT_AREA_CONTAINER: 'HIT_AREA_CONTAINER',
  BG_IMAGE: 'BG_IMAGE',
  TINTABLE_SURFACE: 'TEST_ID_TINTABLE_SURFACE'
}

const SimpleTintableScene = (props: SimpleTintableSceneProps): JSX.Element => {
  const {
    sceneType,
    background,
    sceneName,
    width,
    height,
    imageValueCurve,
    surfaceUrls,
    surfaceIds,
    highlights,
    shadows,
    surfaceHitAreas,
    interactive,
    handleSurfaceInteraction,
    surfaceColors,
    adjustSvgHeight
  } = props
  const [instanceId] = useState(uniqueId('TS'))
  const hitAreaLoadingCount = useRef(0)
  const [hitAreaError, setHitAreaError] = useState(false)
  const [hitAreaLoaded, setHitAreaLoaded] = useState(props.surfaceUrls.length === 0)

  const handleHitAreaLoadingSuccess = (): void => {
    hitAreaLoadingCount.current++
    if (hitAreaLoadingCount.current === props.surfaceUrls.length) {
      setHitAreaLoaded(true)
    }
  }
  const handleHitAreaLoadingError = (): void => {
    setHitAreaError(true)
  }

  const handleClickSurface = (surfaceIndex: number): void => {
    if (handleSurfaceInteraction) {
      handleSurfaceInteraction(surfaceIndex)
    }
  }

  return (
    <>
      {/* The transitions group will assume the calculated height of the ROOT DIV and not necessarily the specified height of the parent div */}
      <div data-testid={TEST_ID.SURFACES_CONTAINER}>
        <img
          className={`block w-full relative h-auto`}
          src={background}
          alt={sceneName}
          data-testid={TEST_ID.BG_IMAGE}
        />
        <TransitionGroup className={`absolute top-0 h-full w-full`}>
          {surfaceUrls.map((surface: string, i): JSX.Element => {
            const highlight: string = highlights && surfaceUrls.length === highlights.length ? highlights[i] : null
            const shadow: string = shadows && surfaceUrls.length === shadows.length ? shadows[i] : null
            const tintColor: Color | MiniColor | null = surfaceColors[i]
            if (tintColor) {
              return (
                <InlineStyleTransition
                  key={`${i}_tintable_surface`}
                  default={{
                    zIndex: 0,
                    opacity: 0,
                    transition: 'opacity 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                  entering={{
                    zIndex: 1,
                    opacity: 1,
                    backfaceVisibility: 'hidden'
                  }}
                  entered={{
                    zIndex: 1,
                    opacity: 1,
                    backfaceVisibility: 'unset',
                    transition: 'opacity 100ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 150ms'
                  }}
                  exiting={{
                    opacity: 0,
                    backfaceVisibility: 'hidden'
                  }}
                  exited={{
                    opacity: 0,
                    backfaceVisibility: 'hidden'
                  }}
                  timeout={1}
                >
                  <TintableSceneSurface
                    adjustSvgHeight={adjustSvgHeight}
                    type={sceneType}
                    image={background}
                    width={width}
                    height={height}
                    maskId={getMaskId(instanceId, surfaceIds[i], tintColor.hex)}
                    filterId={getFilterId(instanceId, surfaceIds[i], tintColor.hex)}
                  >
                    <TintableSceneSVGDefs
                      type={sceneType}
                      highlightMap={highlight}
                      shadowMap={shadow}
                      filterId={getFilterId(instanceId, surfaceIds[i], tintColor.hex)}
                      filterColor={tintColor.hex}
                      filterImageValueCurve={imageValueCurve}
                      maskId={getMaskId(instanceId, surfaceIds[i], tintColor.hex)}
                      maskImage={surface}
                    />
                  </TintableSceneSurface>
                </InlineStyleTransition>
              )
            }

            return null
          })}
        </TransitionGroup>
      </div>
      <div className={`absolute left-0 top-0 w-full h-full`} data-testid={TEST_ID.HIT_AREA_CONTAINER}>
        {interactive
          ? surfaceHitAreas?.map((surface, i) => (
              // @ts-ignore
              <SimpleTintableSceneHitArea
                key={surface}
                surfaceIndex={i}
                onLoadingSuccess={handleHitAreaLoadingSuccess}
                onLoadingError={handleHitAreaLoadingError}
                interactionHandler={() => handleClickSurface(i)}
                svgSource={surface}
              />
            ))
          : null}
      </div>

      {hitAreaError ? (
        <GenericOverlay type={GenericOverlay.TYPES.ERROR} message='Error loading paintable surfaces' />
      ) : interactive && !hitAreaLoaded ? (
        <GenericOverlay type={GenericOverlay.TYPES.LOADING} />
      ) : null}

      {sceneName && <LiveMessage message={`${sceneName} scene has been loaded`} aria-live='polite' />}
    </>
  )
}

export default SimpleTintableScene
