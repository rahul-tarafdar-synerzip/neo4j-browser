import uuid from 'uuid'
import { nodes } from '../../modules/favorites/staticScripts'

// Action type constants
export const NAME = 'nodes'
export const ADD_NODE = 'nodes/ADD_NODE'

export const getNodes = state => state[NAME]
const initialState = nodes

// Actions
export const addNode = () => {
  return { type: ADD_NODE }
}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case ADD_NODE:
      return state.concat([{ id: uuid.v4(), name: 'Unnamed Node' }])
    default:
      return state
  }
}
