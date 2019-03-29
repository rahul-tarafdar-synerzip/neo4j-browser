import { handleCypherCommand } from '../commands/helpers/cypher'
import * as _ from 'lodash'

const initialState = {
  selectedItem: undefined,
  neo4jItem: undefined,
  deletedProperties: []
}

// Action type constants
export const NAME = 'itemEditor'
export const SET_SELECTED_ITEM = `${NAME}/SET_SELECTED_ITEM`
export const EDIT_SELECTED_ITEM = `${NAME}/EDIT_SELECTED_ITEM`
export const FETCH_DATA = `${NAME}/FETCH_DATA`
export const SET_NEO4J_ITEM = `${NAME}/SET_NEO4J_ITEM`
export const UPDATE_DATA = `${NAME}/UPDATE_DATA`
export const DELETE_PROPERTY = `${NAME}/DELETE_PROPERTY`
export const INVERT_DELETE_PROPERTY = `${NAME}/INVERT_DELETE_PROPERTY`
export const CLEAR_DELETE_PROPERTY = `${NAME}/CLEAR_DELETE_PROPERTY`
export const CREATE_NEW_NODE = `${NAME}/CREATE_NEW_NODE`

// Actions

export const setSelectedItem = item => {
  return {
    type: SET_SELECTED_ITEM,
    item
  }
}

export const deleteProperty = property => {
  return {
    type: DELETE_PROPERTY,
    property
  }
}
export const invertDelete = property => {
  return {
    type: INVERT_DELETE_PROPERTY,
    property
  }
}
export const createNewNode = newNode => {
  return {
    type: CREATE_NEW_NODE,
    newNode
  }
}

/**
 *  Action for editing selected item
 */
export const setEditSelectedItem = item => {
  return {
    type: EDIT_SELECTED_ITEM,
    item
  }
}

/**
 * Fetch data action creator
 * @param {*} id The id of the node.
 */
export const fetchData = (id, entityType) => {
  return {
    type: FETCH_DATA,
    id,
    entityType
  }
}

/**
 * Update data action creator
 * @param {*} id The id of the node.
 */
export const UpdateData = (id, entityType) => {
  return {
    type: UPDATE_DATA,
    id,
    entityType
  }
}

// Reducer
export default function reducer (state = initialState, action) {
  let newState
  switch (action.type) {
    case SET_SELECTED_ITEM:
      return { ...state, selectedItem: action.item }
    case EDIT_SELECTED_ITEM:
      return { ...state, neo4jItem: action.item }
    case SET_NEO4J_ITEM:
      return { ...state, neo4jItem: action.item }
    case CREATE_NEW_NODE:
      console.log(action.newNode.name)
      return state
    case DELETE_PROPERTY:
      newState = _.cloneDeep(state)
      newState.deletedProperties.push(action.property)
      return newState
    case CLEAR_DELETE_PROPERTY:
      newState = _.cloneDeep(state)
      newState.deletedProperties = []
      return newState
    case INVERT_DELETE_PROPERTY:
      newState = _.cloneDeep(state)
      _.remove(newState.deletedProperties, v => v === action.property)
      return newState

    default:
      return state
  }
}

// EPICs

/**
 * Epic handle for fetch data
 */
export const handleFetchDataEpic = (action$, store) =>
  action$.ofType(FETCH_DATA).mergeMap(action => {
    const noop = { type: 'NOOP' }
    if (!action.id) {
      return Promise.resolve().then(() => {
        store.dispatch({ type: SET_NEO4J_ITEM, item: undefined })
        return noop
      })
    }
    let cmd = `MATCH (a) where id(a)=${
      action.id
    } RETURN a, ((a)-->()) , ((a)<--())`
    if (action.entityType === 'relationship') {
      cmd = `MATCH ()-[r]->() where id(r)=${action.id} RETURN r`
    }
    let newAction = _.cloneDeep(action)
    newAction.cmd = cmd
    let [id, request] = handleCypherCommand(newAction, store.dispatch)
    return request
      .then(res => {
        if (res && res.records && res.records.length) {
          store.dispatch({ type: SET_NEO4J_ITEM, item: res.records[0] })
        }
        return noop
      })
      .catch(function (e) {
        throw e
      })
  })
/**
 * Epic handle for  update data
 */

export const handleUpdateDataEpic = (action$, store) =>
  action$.ofType(UPDATE_DATA).mergeMap(action => {
    const noop = { type: 'NOOP' }
    let itemProperties = _.cloneDeep(action.id._fields[0].properties)
    let deletedProps = store.getState().itemEditor.deletedProperties
    itemProperties = _.omit(itemProperties, deletedProps)
    itemProperties = _.mapValues(itemProperties, function (
      props_ItemProperties
    ) {
      if (_.isObject(props_ItemProperties)) {
        return props_ItemProperties.low || props_ItemProperties.high || 0
      } else {
        return props_ItemProperties
      }
    })
    let cmd = `match (n) WHERE id(n)=${action.id._fields[0].identity}
    SET n =${JSON.stringify(itemProperties).replace(
    /\"([^(\")"]+)\":/g,
    '$1:'
  )} Return n`
    let newAction = _.cloneDeep(action)
    newAction.cmd = cmd

    let [id, request] = handleCypherCommand(newAction, store.dispatch)
    return request
      .then(res => {
        if (res && res.records && res.records.length) {
          store.dispatch({ type: SET_NEO4J_ITEM, item: res.records[0] })
        }
        store.dispatch({ type: CLEAR_DELETE_PROPERTY })
        return noop
      })
      .catch(function (e) {
        throw e
      })
  })

// Creating new node - EPIC
export const createNewNodeEpic = (action$, store) =>
  action$.ofType(CREATE_NEW_NODE).mergeMap(action => {
    const noop = { type: 'NOOP' }
    let cmd = `CREATE (a:Animals { title : ${JSON.stringify(
      action.newNode.name
    )}})`
    let newAction = _.cloneDeep(action)
    newAction.cmd = cmd
    let [id, request] = handleCypherCommand(newAction, store.dispatch)
    return request
      .then(res => {
        console.log(res)
        return noop
      })
      .catch(function (e) {
        throw e
      })
  })
