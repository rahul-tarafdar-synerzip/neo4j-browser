/*
 * This module maps the props received from EditorInfo and
 * displays the properties,type and entity type of the selected relationship.
 */

import React from 'react'
import {
  Drawer,
  DrawerHeader,
  DrawerSection,
  DrawerSubHeader,
  DrawerBody
} from 'browser-components/drawer/index'
import { getStringValue } from './utils'
import * as _ from 'lodash'

function DisplayRelationshipDetails (props) {
  let content = null
  content = _.map(props.relationshipProperties, (value, key) => {
    return (
      <div key={key}>
        {key}: {getStringValue(value)}
      </div>
    )
  })
  return (
    <div>
      <Drawer>
        <DrawerHeader>Editor</DrawerHeader>
        <DrawerBody>
          <DrawerSection>
            <DrawerSubHeader>Entity Type</DrawerSubHeader>
            {props.entityType}
          </DrawerSection>
          <DrawerSection>
            <DrawerSubHeader>Relationship Type</DrawerSubHeader>
            {props.relationshipType}
          </DrawerSection>
          <DrawerSection>
            <DrawerSubHeader>Relationship Properties</DrawerSubHeader>
            {content}
          </DrawerSection>
        </DrawerBody>
      </Drawer>
    </div>
  )
}

export default DisplayRelationshipDetails
