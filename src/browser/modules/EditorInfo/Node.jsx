import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Node extends Component {
  render () {
    return this.props.textField === true ? (
      <div>
        <label>Node Name: </label>
        <input
          style={{ color: 'black' }}
          type='text'
          name='nodeName'
          onChange={event => this.props.addNode(event.target.value)}
        />
      </div>
    ) : null
  }
}

Node.propTypes = {
  textField: PropTypes.bool,
  addNode: PropTypes.func
}

export default Node
