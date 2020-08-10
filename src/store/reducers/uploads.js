// @flow
import { UPLOAD_COMPLETE, CLEAR_UPLOADS, START_UPLOADING, STOP_UPLOADING, ERROR_UPLOADING } from '../actions/user-uploads'

const initialState: Object = {
  uploading: false,
  error: false
}

export const uploads = (state: Object = initialState, action: { type: string, payload: Object }) => {
  switch (action.type) {
    case START_UPLOADING:
    case STOP_UPLOADING:
    case UPLOAD_COMPLETE:
    case ERROR_UPLOADING:
    case CLEAR_UPLOADS:
      return Object.assign({}, state, {
        ...action.payload
      })

    default:
      return state
  }
}

export const QUEUE_IMAGE_UPLOAD = 'QUEUE_IMAGE_UPLOAD'
export const queueImageUpload = (file: File) => {
  return (dispatch) => {
    dispatch({
      type: QUEUE_IMAGE_UPLOAD,
      payload: file
    })
  }
}

export const DEQUEUE_IMAGE_UPLOAD = 'DEQUEUE_IMAGE_UPLOAD'
export const dequeueImageUpload = () => {
  return (dispatch) => {
    dispatch({
      type: DEQUEUE_IMAGE_UPLOAD,
      payload: null
    })
  }
}

export const queuedImageUpload = (state: File | null = null, action: {type: string, payload: File | null }) => {
  if (action.type === QUEUE_IMAGE_UPLOAD || action.type === DEQUEUE_IMAGE_UPLOAD) {
    return action.payload
  }

  if ([UPLOAD_COMPLETE, ERROR_UPLOADING, STOP_UPLOADING].indexOf(action.type) > -1) {
    return null
  }

  return state
}
