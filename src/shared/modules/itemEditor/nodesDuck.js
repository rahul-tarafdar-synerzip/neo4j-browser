import * as _ from 'lodash'
// Action type constants
export const NAME = 'node'
export const ADD_NODE = 'nodes/ADD_NODE'
export const HANDLE_TOGGLE_NODE_TEXT_BOX = 'nodes/HANDLE_TOGGLE_NODE_TEXT_BOX'

const initialState = { name: undefined, textField: false }

// Actions
export const addNode = value => {
  return { type: ADD_NODE, value }
}

export const handleToggleNodeTextBox = () => {
  return { type: HANDLE_TOGGLE_NODE_TEXT_BOX }
}

// Reducer
export default function reducer (state = initialState, action) {
  let newState
  switch (action.type) {
    case ADD_NODE:
      newState = _.cloneDeep(state)
      newState.name = action.value
      return newState
    case HANDLE_TOGGLE_NODE_TEXT_BOX:
      return {
        ...state,
        textField: !state.textField
      }
    default:
      return state
  }
}
