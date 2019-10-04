export const loadImage = (imgUrl) => {
  const imagePromise = new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', resolve, false)

    img.src = imgUrl
  })

  return imagePromise
}

export const getScaledPortraitHeight = (imageWidth, imageHeight) => {
  return (width) => width * (imageHeight / imageWidth)
}

export const getScaledLandscapeHeight = (imageWidth, imageHeight) => {
  return (width) => width * (imageWidth / imageHeight)
}

export const scaleImage = (img, canvasWidth) => {
  const resizePromise = new Promise((resolve, reject) => {
    const canvasHeight = getScaledPortraitHeight(img.width, img.height)(canvasWidth)
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)

    const payload = {
      dataUrl: null,
      width: Math.ceil(canvasWidth),
      height: Math.ceil(canvasHeight),
      isPortrait: canvasHeight > canvasWidth
    }

    try {
      // payload.data = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
      payload.dataUrl = canvas.toDataURL()
    } catch (e) {
      reject(e)
    } finally {
      ctx = null
      canvas = null
    }
    // An over-abundance of safety
    resolve(payload)
  })

  return resizePromise
}
