// @flow
import { rgb } from 'color-space'
import { getDeltaE00 } from 'delta-e'

export const drawAcrossLine = (context: Object, to: Object, from: Object, shapeDrawer: Function) => {
  let x0 = parseInt(to.x)
  let y0 = parseInt(to.y)
  const x1 = parseInt(from.x)
  const y1 = parseInt(from.y)
  const dx = Math.abs(x1 - x0)
  const dy = Math.abs(y1 - y0)
  const sx = (x0 < x1) ? 1 : -1
  const sy = (y0 < y1) ? 1 : -1
  let err = dx - dy

  while (true) {
    shapeDrawer.call(this, context, x0, y0)

    if ((x0 === x1) && (y0 === y1)) { break }

    let e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      x0 += sx
    }
    if (e2 < dx) {
      err += dx
      y0 += sy
    }
  }
}

// eslint-disable-next-line no-unused-vars
export const imagePathListToImageData = (imagePathList: any, width: number, height: number): Object => {
  // eslint-disable-next-line no-unused-vars
  const imageData = new window.ImageData(width, height)
  const { pixelIndexAlphaMap } = imagePathList

  for (let pixelIndexKey in pixelIndexAlphaMap) {
    const index = parseInt(pixelIndexKey)
    // Use the alpha value to create a grayscale image
    const alphaAsGrey = pixelIndexAlphaMap[pixelIndexKey]
    imageData.data[index] = alphaAsGrey
    imageData.data[index + 1] = alphaAsGrey
    imageData.data[index + 2] = alphaAsGrey
    imageData.data[index + 3] = alphaAsGrey
  }

  return imageData
}

const mapLABArrayToObject = (color) => {
  return {
    L: color[0],
    A: color[1],
    B: color[2]
  }
}

export const separateColors = (colors: Object[], imageData: any, threshold: number, saveAlpha: boolean): Array[] => {
  const pixelBuckets = colors.map(color => [])
  // alpha values need to be saved as a separate list due to image path implementation
  const alphaPixelMaps = colors.map(color => {
    return {}
  })

  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    // convert pixel from RGBA -> LAB
    const pixel = mapLABArrayToObject(rgb.lab([data[i], data[i + 1], data[i + 2], data[i + 3]]))
    for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
      const colorDiff = getDeltaE00(colors[colorIndex], pixel)
      // 1.5 is a good number to use for a threshold
      if (saveAlpha) {
        // This block is for import
        if (colorDiff < threshold) {
          pixelBuckets[colorIndex].push(i)
          alphaPixelMaps[colorIndex][`${i}`] = data[i + 3]
        }
      } else {
        // This block is for export
        if (colorDiff < threshold) {
          pixelBuckets[colorIndex].push(data[i], data[i + 1], data[i + 2], data[i + 3])
        } else {
          pixelBuckets[colorIndex].push(0, 0, 0, 0)
        }
      }
    }
  }

  if (saveAlpha) {
    return {
      pixelIndices: pixelBuckets,
      alphaPixelMaps
    }
  }

  return pixelBuckets
}

export const getUniqueColorsFromPalette = (palette: Object[]) => {
  const colors = palette.map(color => {
    const labColor = rgb.lab([color.red, color.green, color.blue, 255])
    return mapLABArrayToObject(labColor)
  })

  return colors
}

export const processLoadedScene = (ctx: any, colors: Object[], threshold: number, saveAlpha: boolean): Array[] => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  const uniqueColors = getUniqueColorsFromPalette(colors)
  const colorLayers = separateColors(uniqueColors, imageData, threshold, saveAlpha)

  return colorLayers
}

export const createImageDataAndAlphaPixelMapFromImageData = (imageData) => {
  const alphaPixelMap = {}
  const pixelMap = []

  for (let i = 0; i < imageData.data.length; i += 4) {
    // Add if rgb isn't pure black
    if (imageData.data[i] !== 0 && imageData.data[i + 1] !== 0 && imageData.data[i + 2] !== 0) {
      pixelMap.push(i)
      alphaPixelMap[`${i}`] = imageData.data[i + 3]
    }
  }

  return {
    alphaPixelMap,
    pixelMap
  }
}

export const getColorsFromImagePathList = (imagePathList: Object[]) => {
  const paintItems = []
  const paintTypes = ['paint']
  const savedColors = []

  imagePathList.forEach((item, i) => {
    if (item.isEnabled) {
      if (paintTypes.indexOf(item.type) > -1) {
        // In many cases one SHOULD copy an object...however this is a HUUUGE deeply nest object, do not copy.
        // This algorithm should only be used during blocking operations and the product should not be stored, it should be ephemeral.
        paintItems.push(item)
      }
    }
  })

  paintItems.forEach((item, i) => {
    const colorId = item.colorRef.id
    if (!savedColors.find(color => color.id === colorId)) {
      savedColors.push(item.colorRef)
    }
  })

  return savedColors
}

export const getLABFromColor = (colorObj: Object) => {
  const color = rgb.lab([colorObj.red, colorObj.green, colorObj.blue])

  return {
    L: color[0],
    A: color[1],
    B: color[2]
  }
}
