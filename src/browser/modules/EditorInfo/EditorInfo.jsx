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
import * as itemEditor from 'shared/modules/itemEditor/itemEditorDuck'
import { getSelectedItem } from 'shared/modules/selectors/itemEditor'
import {
  addNode,
  handleToggleNodeTextBox
} from '../../../shared/modules/itemEditor/nodesDuck'
import { NewNodeButton } from '../Sidebar/styled'
import Node from './Node'
import * as itemEditorActions from 'shared/modules/itemEditor/itemEditorDuck'

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
                  editEntityAction={this.props.editEntityAction}
                  removeClick={this.props.removeClick}
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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNode: value => {
      const action = addNode(value)
      dispatch(action)
    },
    handleToggleNodeTextBox: () => {
      const action = handleToggleNodeTextBox()
      dispatch(action)
    },
    removeClick: (propertykey, propertyvalue) => {
      const action = itemEditor.removeClick(propertykey, propertyvalue)
      dispatch(action)
    },
    editEntityAction: (nodeId, firstLabel, editType, entityType) => {
      const action = itemEditorActions.editEntityAction(
        nodeId,
        firstLabel,
        editType,
        entityType
      )
      ownProps.bus.send(action.type, action)
    }
  }
}

export default withBus(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditorInfo)
)
