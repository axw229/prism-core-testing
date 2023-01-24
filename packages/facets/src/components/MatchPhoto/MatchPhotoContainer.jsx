/**
 * This component encapsulates all of the match photo logic
 */
// @flow
import React, { useEffect, useRef, useState } from 'react'
import type { Color } from '../../shared/types/Colors'
import type { ImageDimensions } from '../../shared/types/lib/CVWTypes'
import PrismImage from '../PrismImage/PrismImage'
import type { PrismImageData } from "../PrismImage/PrismImage.jsx";
import { CircleLoader } from '../ToolkitComponents'
import ColorPinsGenerationByHue from './workers/colorPinsGenerationByHue.worker'
import MatchPhoto from './MatchPhoto'
import './MatchPhotoContainer.scss'

type MatchPhotoContainerProps = {
  colors: Color[],
  imageDims: ImageDimensions,
  imageUrl: string,
  maxSceneHeight: number,
  scalingWidth: number
}

const MatchPhotoContainer = (props: MatchPhotoContainerProps) => {
  const { colors, imageDims, imageUrl, maxSceneHeight, scalingWidth } = props
  const imageRef = useRef()
  const [height, setHeight] = useState(0)
  const [imageData, setImageData] = useState(null)
  const [imageIsPortrait, setImageIsPortrait] = useState(null)
  const [pins, setPins] = useState(null)
  const [width, setWidth] = useState(0)

  const handleImageLoaded = (payload: PrismImageData) => {
    const { data, height, isPortrait, width } = payload
    setHeight(height)
    setImageData(data)
    setImageIsPortrait(isPortrait)
    setWidth(width)
  }

  useEffect(() => {
    if (colors && imageData && !pins) {
      // $FlowIgnore - flow can't understand how the worker is being used since it's not exporting anything
      const colorPinsGenerationByHueWorker = new ColorPinsGenerationByHue()

      const messageHandler = (e: any) => {
        const { pinsRandom } = e.data
        setPins(pinsRandom)

        if (colorPinsGenerationByHueWorker) {
          colorPinsGenerationByHueWorker.removeEventListener('message', messageHandler)
          colorPinsGenerationByHueWorker.terminate()
        }
      }

      colorPinsGenerationByHueWorker.addEventListener('message', messageHandler)
      colorPinsGenerationByHueWorker.postMessage({ imageData: imageData, imageDimensions: { width: width, height: height }, colors })
    }
  }, [colors, height, imageData, imageUrl, pins, width])

  return (<div className='match-photo-container-wrapper'>
    {imageUrl && (
      <PrismImage loadedCallback={handleImageLoaded} ref={imageRef} scalingWidth={scalingWidth} source={imageUrl} />
    )}
    {pins ? (
      <MatchPhoto
        imageUrl={imageUrl}
        wrapperWidth={scalingWidth}
        isPortrait={imageIsPortrait}
        imageDims={imageDims}
        pins={pins}
        maxHeight={maxSceneHeight}
      />
    ) : (
      <CircleLoader />
    )}
  </div>)
}

export default MatchPhotoContainer
