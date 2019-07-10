import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  DrawerSection,
  DrawerSubHeader,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { getStringValue } from './utils'
import * as _ from 'lodash'
import classNames from 'classnames'
import styles from '../DatabaseInfo/style_meta.css'
import { chip, StyledKeyEditor, EditPropertiesInput } from './styled'
import {
  StyledTable,
  StyledValue,
  StyledRelationship
} from '../DatabaseInfo/styled'
import {
  BinIcon,
  EditIcon,
  ExpandMenuIcon,
  CollapseMenuIcon
} from 'browser-components/icons/Icons'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import { FoldersButton } from '../Sidebar/styled'

/**
 * Creates items to display in chip format
 * @param {*} originalList Item list
 * @param {*} RenderType The render type
 */
const createItems = (originalList, RenderType) => {
  let items = [...originalList]

  return items.map((text, index) => {
    return (
      <RenderType.component data-testid='sidebarMetaItem' key={index}>
        {text}
      </RenderType.component>
    )
  })
}

/**
 * Label section
 * @param {*} props
 */
const LabelSection = props => {
  let { node } = props
  let labelItems = <p>There are no labels for this node</p>
  if (node.labels.length) {
    labelItems = createItems(node.labels, { component: chip })
  }
  return (
    <DrawerSection>
      <DrawerSubHeader>Labels</DrawerSubHeader>
      <DrawerSectionBody
        className={classNames({
          [styles['wrapper']]: true
        })}
      >
        {labelItems}
      </DrawerSectionBody>
    </DrawerSection>
  )
}
LabelSection.propTypes = {
  node: PropTypes.object
}

/**
 * Entity Section
 */
export const EntitySection = props => {
  return (
    <DrawerSection>
      <DrawerSubHeader>Entity</DrawerSubHeader>
      {props.type}
      {props.type === 'Node' && (
        <ConfirmationButton
          requestIcon={<BinIcon />}
          confirmIcon={<BinIcon deleteAction />}
          onConfirmed={() => {
            props.editEntityAction(
              {
                nodeId: props.node.identity.toInt(),
                firstLabel: props.node.labels[0]
              },
              'delete',
              'node'
            )
          }}
        />
      )}
    </DrawerSection>
  )
}
EntitySection.propTypes = {
  node: PropTypes.object,
  editEntityAction: PropTypes.func
}

/**
 * Properties section
 * @param {*} props
 */

export const PropertiesSection = props => {
  const initState = {
    properties: { ...props.properties }
  }

  const [propertiesState, updatePropertiesState] = useState(initState)

  /**
   * useEffect accepts a function that updates the state whenever the props change
   * @param updatePropertiesState — Function that returns an updated state everytime props change
   * @param deps —  Will activate when the props change
   */
  useEffect(
    () => {
      updatePropertiesState({
        ...propertiesState,
        properties: { ...props.properties }
      })
    },
    [props.properties]
  )

  const handleChange = (key, e) => {
    let newState = _.cloneDeep(propertiesState)
    updatePropertiesState({
      ...newState,
      properties: {
        ...newState.properties,
        [key]: getStringValue(e.target.value)
      }
    })
  }

  let content = []
  if (propertiesState.properties) {
    content = _.map(propertiesState.properties, (value, key) => {
      return (
        <div key={key}>
          <StyledTable>
            <tbody>
              <tr>
                <StyledKeyEditor>{key}:</StyledKeyEditor>
                <StyledValue data-testid='user-details-username'>
                  <EditPropertiesInput
                    id='item'
                    type='text'
                    onChange={e => {
                      handleChange(key, e)
                    }}
                    value={getStringValue(value)}
                  />

                  <ConfirmationButton
                    requestIcon={<EditIcon />}
                    confirmIcon={<EditIcon deleteAction />}
                    onConfirmed={() => this.props.removeClick(key, value)}
                  />
                  <ConfirmationButton
                    requestIcon={<BinIcon />}
                    confirmIcon={<BinIcon deleteAction />}
                    onConfirmed={() => {
                      props.editEntityAction(
                        {
                          [props.node ? 'nodeId' : 'relationshipId']: props.node
                            ? props.node.identity.toInt()
                            : props.relationship.identity.toInt(),
                          [props.node ? 'label' : 'type']: props.node
                            ? props.node.labels[0]
                            : props.relationship.type,
                          propertyKey: key
                        },
                        'delete',
                        props.node ? 'nodeProperty' : 'relationshipProperty'
                      )
                    }}
                  />
                </StyledValue>
              </tr>
            </tbody>
          </StyledTable>
        </div>
      )
    })
  }
  if (!content.length) {
    content.push(
      <p>{`There are no properties for this ${props.entityType}`}</p>
    )
  }
  return (
    <DrawerSection>
      <DrawerSubHeader>Properties</DrawerSubHeader>
      {content}
    </DrawerSection>
  )
}

PropertiesSection.propTypes = {
  properties: PropTypes.object,
  editEntityAction: PropTypes.func
}

/**
 * Node editor.
 * Provides editing capabilities for node labels and properties
 * @param {*} props
 */
const DisplayNodeDetails = props => {
  return (
    <React.Fragment>
      <EntitySection {...props} type='Node' />
      <LabelSection {...props} />
      <PropertiesSection
        {...props}
        properties={props.node ? props.node.properties : null}
        editEntityAction={props.editEntityAction}
        entityType='node'
      />
      <RelationshipSection
        fromSelectedNode={props.fromSelectedNode}
        toSelectedNode={props.toSelectedNode}
        entityType={props.entityType}
      />
    </React.Fragment>
  )
}

DisplayNodeDetails.propTypes = {
  node: PropTypes.object,
  editEntityAction: PropTypes.func,
  entityType: PropTypes.string,
  fromSelectedNode: PropTypes.array,
  toSelectedNode: PropTypes.array
}

/**
 * Method to show the relationship details for the selected node
 * @param {array} selectedNodeRelationship array containing the relationship details
 * @param {string} entityType entity type, either node or relationship
 * @param {string} relationshipEndpoint relationship endpoint, either from or to
 */
const showRelationshipDetails = (
  selectedNodeRelationship,
  entityType,
  relationshipEndpoint
) => {
  let relationShipArray = []
  if (selectedNodeRelationship) {
    relationShipArray = _.map(selectedNodeRelationship, (value, key) => {
      return (
        <div key={key}>
          <StyledTable>
            <tbody>
              <tr>
                <StyledKeyEditor>R{key + 1}:</StyledKeyEditor>
                <StyledValue data-testid='user-details-username'>
                  {relationshipEndpoint === 'from' && ' ----> '}
                  {relationshipEndpoint === 'to' && ' <---- '}
                  {/* displaying node ID */}
                  {value.end.identity.toInt()}
                  {/* displaying relationship type */}
                </StyledValue>
                <ExpandDetails value={value} />
              </tr>
            </tbody>
          </StyledTable>
        </div>
      )
    })
  }
  if (!relationShipArray.length) {
    relationShipArray.push(
      <p
      >{`There are no relationships ${relationshipEndpoint} this ${entityType}`}</p>
    )
  }
  return relationShipArray
}

/**
 * Component to Expand Relationship Details
 * @param {*} props
 */
const ExpandDetails = props => {
  const [active, setFlag] = useState(false)
  return (
    <FoldersButton onClick={() => setFlag(!active)}>
      {active === true ? <CollapseMenuIcon /> : <ExpandMenuIcon />}
      {active === true && (
        <StyledRelationship>
          {props.value.segments.map((item, index) => item.relationship.type)}
        </StyledRelationship>
      )}
    </FoldersButton>
  )
}

ExpandDetails.propTypes = {
  value: PropTypes.object
}

/**
 * Relationship Section
 */
export const RelationshipSection = props => {
  return (
    <DrawerSection>
      <DrawerSubHeader>Relationships</DrawerSubHeader>
      <DrawerSubHeader>From Selected Node</DrawerSubHeader>
      {showRelationshipDetails(
        props.fromSelectedNode,
        props.entityType,
        'from'
      )}
      <DrawerSubHeader>To Selected Node</DrawerSubHeader>
      {showRelationshipDetails(props.toSelectedNode, props.entityType, 'to')}
    </DrawerSection>
  )
}

RelationshipSection.propTypes = {
  entityType: PropTypes.string,
  fromSelectedNode: PropTypes.array,
  toSelectedNode: PropTypes.array
}

export default DisplayNodeDetails
