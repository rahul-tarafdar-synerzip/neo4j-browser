/**
 * This program allows you to add new node
 **/
import React from 'react'

function AddNode (props) {
  return (
    <div>
      id:
      <br />
      <input
        id='id'
        style={{ color: 'black' }}
        onChange={props.nodeAddHandleChange}
      />
      name:
      <br />
      <input
        id='name'
        style={{ color: 'black' }}
        onChange={props.nodeAddHandleChange}
      />
      <hr />
      <div
        data-testid='sidebarMetaItem'
        className='styled__chip-sc-1srdf8s-0 styled__StyledLabel-sc-1srdf8s-1 eGKpnH'
        style={{
          width: '90px',
          height: 'auto',
          float: 'left'
        }}
        onClick={() => {
          props.saveNewNode()
          props.closeNode()
        }}
      >
        Save
      </div>
      <div
        data-testid='sidebarMetaItem'
        className='styled__chip-sc-1srdf8s-0 styled__StyledLabel-sc-1srdf8s-1 eGKpnH'
        style={{
          width: '90px',
          height: 'auto',
          float: 'right'
        }}
        onClick={props.closeNode}
      >
        Cancel
      </div>
    </div>
  )
}

export default AddNode
