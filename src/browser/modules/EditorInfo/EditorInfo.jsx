import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withBus } from 'react-suber'
import DisplayNodeDetails from './DisplayNodeDetails'
import DisplayRelationshipDetails from './DisplayRelationshipDetails'
import {
  Drawer,
  DrawerHeader,
  DrawerBody
} from 'browser-components/drawer/index'
import { getSelectedItem } from 'shared/modules/selectors/itemEditor'
import {
  addNode,
  handleToggleNodeTextBox
} from '../../../shared/modules/itemEditor/nodesDuck'
import { NewNodeButton } from '../Sidebar/styled'
import Node from './Node'
/**
 * The Editor drawer.
 * Based on selection, either provides node editor or relationship editor.
 * If nothing is selected then it prompts to do so.
 */
export class EditorInfo extends Component {
  render () {
    return (
      <div>
        <Drawer>
          <DrawerHeader>
            Editor
            <NewNodeButton onClick={this.props.handleToggleNodeTextBox} />
            <Node
              addNode={this.props.addNode}
              textField={this.props.textField}
            />
          </DrawerHeader>

          <DrawerBody>
            {this.props.selectedItem ? (
              this.props.entityType === 'node' ? (
                <DisplayNodeDetails
                  node={this.props.selectedItem}
                  addNode={this.props.addNode}
                  textField={this.props.textField}
                />
              ) : (
                <DisplayRelationshipDetails
                  relationship={this.props.selectedItem}
                />
              )
            ) : null}
          </DrawerBody>
        </Drawer>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    selectedItem: getSelectedItem(state),
    entityType: state.itemEditor.entityType,
    textField: state.node.textField
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addNode: value => {
      const action = addNode(value)
      dispatch(action)
    },
    handleToggleNodeTextBox: () => {
      const action = handleToggleNodeTextBox()
      dispatch(action)
    }
  }
}

export default withBus(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditorInfo)
)
