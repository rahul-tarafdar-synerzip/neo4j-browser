/**
 * This function component is used to display the node properties.
 * Also it provides functionality such as edit and delete existing
 * properties of node.
 */
import React from 'react'
import * as _ from 'lodash'
// import { strikethrough } from "../../../../node_modules/ansi-colors/types/index";

function EditProperties (props) {
  const itemProperties = props.itemProperties
  console.log(props.invalidProperty)
  return (
    <div>
      {itemProperties &&
        Object.keys(itemProperties).map(key => {
          let value
          if (typeof itemProperties[key] === 'object') {
            value =
              itemProperties[key].high == 0
                ? itemProperties[key].low
                : itemProperties[key].high
          } else {
            value = itemProperties[key]
          }
          const isPropertyDeleted = !!_.find(
            props.deletedProperties,
            v => v === key
          )
          const isValid = !!_.find(props.invalidProperty, v => v === key)
          const invalidValue = !!isValid
          console.log(isValid)
          const strikethroughValue = isPropertyDeleted ? 'line-through' : 'none'
          return (
            <div
              style={{ textDecoration: strikethroughValue, invalidValue }}
              key={key}
            >
              <div
                data-testid='sidebarMetaItem'
                className='styled__chip-sc-1srdf8s-0 styled__StyledLabel-sc-1srdf8s-1 eGKpnH'
                style={{
                  width: 'auto',
                  height: '20px',
                  float: 'right'
                }}
                onClick={e => {
                  isPropertyDeleted
                    ? props.invertDelete(key)
                    : props.deleteProperty(key, e)
                }}
              >
                <p
                  style={{
                    marginTop: '-11px',
                    marginLeft: '-2px',
                    marginRight: '-2px'
                  }}
                >
                  {isPropertyDeleted ? 'Undo' : 'X'}
                </p>
              </div>
              {key}:{isValid ? '******' : null}
              {props.disabled ? (
                value
              ) : (
                <div>
                  <input
                    id='item'
                    style={{ color: 'black' }}
                    type='text'
                    value={itemProperties[key]}
                    onChange={e => {
                      isValid ? props.invalidProperty(key, e) : null,
                      props.handleChange(key, e, typeof itemProperties[key])
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}

export default EditProperties
