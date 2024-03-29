/* In the real world this component requires the width and height of the initial image to be available at load time
In practice, the facet will not load fastmask until the image has been preloaded. This design intentionally flattened this
time dimensionality for simplicity
* @todo this comp needs to be rewritten when we start masking multiple surfaces. -RS
 */
/* global FormData */
import React, { ReactNode, SyntheticEvent, useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import cloneDeep from 'lodash/cloneDeep'
import { SCENE_TYPES, SYSTEM_ERROR } from '../../constants'
import type {
  BasicVariant,
  Color,
  FastMaskOpenCache,
  FlatScene,
  FlatVariant,
  PreparedSurface,
  ReferenceDimensions
} from '../../types'
import { primeImage } from '../../utils/utils'
import CircleLoader from '../circle-loader/circle-loader'
import SceneView, { SceneViewContent } from '../scene-view/scene-view'
import { createScenesAndVariants } from './fast-mask-utils'

export const TEST_ID = 'fast-mask-view'
export const TEST_ID_1 = `${TEST_ID}_1`
export const TEST_ID_1_CHILD = `${TEST_ID}_child`
export const TEST_ID_TINT_WRAPPER = `${TEST_ID}_tint-wrapper`
export const TEST_ID_ALT_SPINNER = `${TEST_ID}_spinner`
export const TEST_ID_PRELOADER = `${TEST_ID}_preloader`
export const TEST_ID_LOADING_MSG = `${TEST_ID}_loading`
export const TEST_ID_LOADING_BG = `${TEST_ID_LOADING_MSG}_bg`

export interface FastMaskContent {
  userUploadAlt: string
  sceneView: SceneViewContent
}

export interface FastMaskProps {
  apiUrl: string
  handleSceneBlobLoaderError: ({ type, err }: { type: string; err: string }) => void
  refDims?: ReferenceDimensions
  imageUrl: string
  activeColor: Color
  handleUpdates: (data: PreparedSurface) => void
  cleanupCallback: () => void
  savedData?: FastMaskOpenCache
  initHandler?: () => void
  isForCVW?: boolean
  showSpinner?: boolean
  // this maps to multiple divs
  loadingMessage?: string[]
  spinner?: ReactNode
  handleError?: (err: Error | AxiosError) => void
  shouldPrimeImage?: boolean
  content: FastMaskContent
}

interface InitImageDimensions {
  width: number
  height: number
}

interface NestedArrayResponse {
  per_img_resp: Array<
    [
      {
        payload: {
          id: string
          lumped_path: string
          mask_path0: string
          orig_path: string
          original_img_path: string
          ran_realcolor: string
          tinted_path: string
        }
      },
      number
    ]
  >
}

function getInitDimsFromRef(refDims: ReferenceDimensions | null | undefined): InitImageDimensions | null {
  if (refDims) {
    return {
      width: refDims.imageWidth,
      height: refDims.imageHeight
    }
  }

  return null
}

function FastMaskView(props: FastMaskProps): JSX.Element {
  const {
    handleSceneBlobLoaderError,
    refDims,
    imageUrl,
    activeColor,
    savedData,
    initHandler,
    isForCVW,
    showSpinner,
    loadingMessage,
    spinner,
    shouldPrimeImage,
    apiUrl,
    content
  } = props
  const [blobData, setBlobData] = useState(null)
  const [surfaceColors, setSurfaceColors] = useState<Color[]>([])
  const [scenesCollection, setScenesCollection] = useState<FlatScene[]>([])
  const [variantsCollection, setVariantsCollection] = useState<Array<BasicVariant | FlatVariant>>([])
  const [blobUrls, setBlobUrls] = useState([])
  const [sceneUid, setSceneUid] = useState(null)
  const [tintingColor, setTintingColor] = useState(activeColor)
  // This also acts as an additional ready flag
  const [initImageDims, setinitImageDims] = useState<InitImageDimensions | null>(getInitDimsFromRef(refDims))
  // bypass priming logic if there is no shouldPrimeImage flag
  const [imageProcessed, setImageProcessed] = useState(!shouldPrimeImage)

  useEffect(() => {
    if (variantsCollection.length) {
      // theres only 1 variant for fast mask
      const { width: sceneWidth, height: sceneHeight } = scenesCollection.at(0)
      const variant = variantsCollection.at(0)
      setSurfaceColors([activeColor])

      // Data is already formated, no need to 'prepare'
      props.handleUpdates({
        image: variant.image,
        surfaces: variant.surfaces,
        width: sceneWidth,
        height: sceneHeight,
        surfaceColors: [activeColor],
        variantName: variant.variantName,
        sceneType: SCENE_TYPES.FAST_MASK
      })
    }

    setTintingColor(activeColor)
  }, [activeColor, variantsCollection, scenesCollection])

  useEffect(() => {
    if (initHandler) {
      initHandler()
    }

    if (refDims) {
      const width = refDims.isPortrait ? refDims.portraitWidth : refDims.landscapeWidth
      const height = refDims.isPortrait ? refDims.portraitHeight : refDims.landscapeHeight

      setinitImageDims({
        width,
        height
      })
    }

    if (savedData) {
      // This view handles
      const { width: sceneWidth, height: sceneHeight } = savedData.scene
      setinitImageDims({
        width: sceneWidth,
        height: sceneHeight
      })
      setSceneUid(savedData.scene.uid)
      setScenesCollection([cloneDeep(savedData.scene)])
      setSurfaceColors(savedData.surfaceColors)
      setVariantsCollection([cloneDeep(savedData.variant)])
    } else {
      // convert base 64 from possible rotation into a blob for upload to nanonets
      axios
        .get(imageUrl, { responseType: 'blob' })
        .then((res) => {
          setBlobData(res.data)
        })
        .catch((err) => {
          const errorMessage: string = err.message ? err.message : (err as string)
          console.error(`Error loading user image ${errorMessage}`)
        })
    }
    return () => props.cleanupCallback()
  }, [])

  useEffect(() => {
    // use this to prevent ajax call from holding on to refs when this unmounts
    let isLive = true
    if (blobData && !variantsCollection.length) {
      const uploadForm = new FormData()
      uploadForm.append('image', blobData)

      axios
        .post<NestedArrayResponse>(apiUrl, uploadForm, {})
        .then((res) => {
          const mask = res.data.per_img_resp[0][0].payload
          if (!mask) {
            throw new Error('No relevant data in response')
          }

          return mask
        })
        .then(async (data) => {
          // eslint-disable-next-line camelcase,@typescript-eslint/naming-convention
          const { mask_path0, original_img_path } = data
          // eslint-disable-next-line camelcase
          const mask = mask_path0
          // eslint-disable-next-line camelcase
          const originalImage = original_img_path

          // Load mask and background
          return await Promise.all(
            [originalImage, mask].map(async (url, index) => {
              // THIS IS A WORKAROUND FOR THE MISSING original_img_path, since we have it in memory still lets just use it.
              if (index === 0 && !url) {
                const bgImagePromise = new Promise((resolve, reject) => {
                  // Wrap the blob in an object that mimics the axios response.
                  // The createScenesAndVariants function expects this form.
                  resolve({ data: blobData })
                })

                return await bgImagePromise
              }
              return await axios.get(url, {
                responseType: 'blob'
              })
            })
          )
        })
        .then((resp) => {
          // save mask and background as blobs in the browser
          if (isLive) {
            try {
              // "blobUrls" was not a scope issue in facets but for some reason it is now, atleast when debugging... so I renamed -RS
              const _blobUrls = resp.map(({ data }: { data: Blob }) => URL.createObjectURL(data))
              const { sceneUid, scenes, variants } = createScenesAndVariants(
                [_blobUrls],
                initImageDims.width,
                initImageDims.height
              )

              // There is only one variant for fast mask, the main one.
              setBlobUrls(_blobUrls)
              setSceneUid(sceneUid)
              setScenesCollection(scenes)
              setSurfaceColors([tintingColor])
              setVariantsCollection(variants)
            } catch {
              handleSceneBlobLoaderError({
                type: SYSTEM_ERROR,
                err: `Blob urls not created for fast mask error`
              })
            }
          } else {
            console.warn('User interrupted the promise resolution.')
          }
        })
        .catch((err: Error | AxiosError) => {
          console.error('issue with segmentation: ', err)
          if (props.handleError) {
            props.handleError(err)
          }
        })
    }
    return () => {
      isLive = false
    }
  }, [blobData, variantsCollection, refDims])

  useEffect(() => {
    return () => {
      if (blobUrls.length) {
        blobUrls.forEach((url) => {
          URL.revokeObjectURL(url)
        })
      }
    }
  }, [blobUrls])

  useEffect(() => {
    let isLive = true
    if (variantsCollection.length && !imageProcessed) {
      const handleImagePrimed = (img: string): void => {
        if (!isLive) {
          return
        }
        setImageProcessed(true)

        variantsCollection[0].image = img
        setVariantsCollection(cloneDeep(variantsCollection))
      }

      const { image, surfaces } = variantsCollection[0]
      primeImage(image, surfaces[0].surfaceBlobUrl, handleImagePrimed)
    }

    return () => {
      isLive = false
    }
  }, [variantsCollection, imageProcessed])

  const handleImageLoaded = (e: SyntheticEvent<HTMLImageElement>): void => {
    const { width, height } = e.target as HTMLImageElement
    setinitImageDims({
      width,
      height
    })
  }

  return (
    <>
      {/* This preloads the image to get the initial dimemsions */}
      {!initImageDims ? (
        <img
          data-testid={TEST_ID_PRELOADER}
          className='hidden invisible'
          src={imageUrl}
          alt=''
          onLoad={handleImageLoaded}
        />
      ) : null}
      {imageProcessed && initImageDims && variantsCollection.length && !showSpinner ? (
        <div data-testid={TEST_ID} className={isForCVW ? 'min-h-[400px] flex justify-center items-center' : ''}>
          <div data-testid={TEST_ID_TINT_WRAPPER}>
            <SceneView
              spinner={spinner}
              key={sceneUid}
              surfaceColorsFromParents={surfaceColors}
              selectedSceneUid={sceneUid}
              scenesCollection={scenesCollection}
              variantsCollection={variantsCollection}
              content={content.sceneView}
            />
          </div>
        </div>
      ) : (
        <div data-testid={TEST_ID_1} className='w-100 h-100 bg-white'>
          <div
            data-testid={TEST_ID_1_CHILD}
            className={isForCVW ? 'min-h-[400px]' : 'flex justify-center items-center w-100 h-auto'}
          >
            {imageUrl && (
              <img
                data-testid={TEST_ID_LOADING_BG}
                src={imageUrl}
                className='w-100 opacity-40'
                alt={content.userUploadAlt}
              />
            )}
            <div className='flex justify-center flex-col absolute w-100 h-auto z-[999]'>
              {spinner ? (
                <div data-testid={TEST_ID_ALT_SPINNER} className='w-100 flex justify-center'>
                  {spinner}
                </div>
              ) : (
                <CircleLoader />
              )}
              {loadingMessage?.length ? (
                <div
                  data-testid={TEST_ID_LOADING_MSG}
                  className='flex justify-center flex-col absolute w-100 h-auto z-[999]'
                >
                  {loadingMessage.map((msg) => {
                    return (
                      <div className='pt-[1%]' key={msg}>
                        {msg}
                      </div>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FastMaskView
