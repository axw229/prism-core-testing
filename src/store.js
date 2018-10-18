import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import rootReducer from './reducers/rootReducer'

const loggerMiddleware = createLogger()

// TODO: Hydrate the initialState from localStorage if it exists
const initialState = {
  lp: {
    colors: []
  }
}

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

export default store