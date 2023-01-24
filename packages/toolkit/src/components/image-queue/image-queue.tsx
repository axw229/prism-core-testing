import React, { ReactNode, SyntheticEvent } from 'react'

export interface ImageQueueProps {
  dataUrls: string[]
  addToQueue: (image: SyntheticEvent, i: number) => void
}

export const TEST_ID_IMAGE_QUEUE_IMAGE = 'TEST_ID_IMAGE_QUEUE_IMAGE'

const ImageQueue = (props: ImageQueueProps): JSX.Element => {
  const mapImages = (dataUrls: string[]): ReactNode => {
    return dataUrls.map((dataUrl, i) => {
      return (
        <img
          data-testid={TEST_ID_IMAGE_QUEUE_IMAGE}
          aria-hidden='true'
          crossOrigin={'anonymous'}
          src={dataUrl}
          key={`${i}`}
          id={`${i}`}
          className='invisible hidden'
          alt=''
          onLoad={(e) => props.addToQueue(e, i)}
        />
      )
    })
  }

  return <>{mapImages(props.dataUrls)}</>
}

export default ImageQueue
