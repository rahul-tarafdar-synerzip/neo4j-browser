import { createSelector } from 'reselect'

const getEntityType = state => state.itemEditor.entityType
const getRecord = state => state.itemEditor.record
/**
 * Get selected item from state.
 *
 * @param {*} state
 * @returns Either Node or Relationship or null
 */
export const getSelectedItem = createSelector(
  [getEntityType, getRecord],
  (entityType, record) => {
    entityType = entityType || 'node'
    if (entityType === 'node' && record && record.has && record.has('a')) {
      return (
        record &&
        record.get && {
          node: record.get('a'),
          fromSelectedNode: record.get('((a)-->())'),
          toSelectedNode: record.get('((a)<--())')
        }
      )
    } else if (
      entityType === 'relationship' &&
      record &&
      record.has &&
      record.has('r')
    ) {
      return record && record.get && record.get('r')
    }
    return null
  }
)
