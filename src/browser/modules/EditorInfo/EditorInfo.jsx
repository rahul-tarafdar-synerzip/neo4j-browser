/*
 * This module depicts the behaviour of the edit drawer and
 * it imports DisplayNodeDetails which is used for rendering
 * selected node's properties.
 * Also,it imports DisplayRelationshipDetails which is used for rendering
 * selected relationship's properties.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withBus } from 'react-suber'
import DisplayNodeDetails from './DisplayNodeDetails'
import DisplayRelationshipDetails from './DisplayRelationshipDetails'
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'

export class EditorInfo extends Component {
  render () {
    return this.props.selectedItem ? (
      this.props.entityType == 'node' ? (
        <div>
          <DisplayNodeDetails
            selectedItem={this.props.selectedItem._fields[0].properties}
            entityType={this.props.entityType}
            labels={this.props.selectedItem._fields[0].labels}
          />
        </div>
      ) : (
        <div>
          <DisplayRelationshipDetails
            relationshipType={this.props.selectedItem._fields[0].type}
            relationshipProperties={
              this.props.selectedItem._fields[0].properties
            }
            entityType={this.props.entityType}
          />
        </div>
      )
    ) : (
      <Drawer id='db-drawer'>
        <DrawerHeader>Editor</DrawerHeader>
        <DrawerBody>
          <DrawerSection>
            <DrawerSectionBody>
              Please select a node or relationship
            </DrawerSectionBody>
          </DrawerSection>
        </DrawerBody>
      </Drawer>
    )
  }
}

const mapStateToProps = state => {
  return {
    selectedItem: state.itemEditor.selectedItem,
    entityType: state.itemEditor.entityType
  }
}

export default withBus(connect(mapStateToProps)(EditorInfo))
