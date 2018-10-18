const initialState = {
  scenes: [],
  scene: '',
  selectedColor: {},
  numScenes: 0,
  loadingScenes: true
}

export const scenes = (state = initialState, action) => {
  switch (action.type) {
    case 'COLOR_SELECTED':
      return Object.assign({}, state, {
        selectedColor: action.payload.color
      })

    case 'SELECT_SCENE':
      return Object.assign({}, state, {
        scene: action.payload.scene
      })

    case 'RECEIVE_SCENES':
      return Object.assign({}, state, {
        scenes: action.payload.scenes,
        numScenes: action.payload.numScenes,
        loadingScenes: action.payload.loadingScenes
      })

    case 'REQUEST_SCENES':
      return Object.assign({}, state, {
        loadingScenes: action.payload.loadingScenes
      })

    default:
      return state
  }
}