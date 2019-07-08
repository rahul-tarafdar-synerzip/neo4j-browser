import React, { Component } from 'react'
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
import { StyledTable, StyledValue } from '../DatabaseInfo/styled'
import styled from 'styled-components'
import { BinIcon, EditIcon } from 'browser-components/icons/Icons'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'

const IconButton = styled.button`
  margin-left: 4px;
  border: 0;
  background: white;
  color: black;
  &:focus {
    outline: solid;
  }
`

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
export class PropertiesSection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      properties: this.props.properties,
      toggleRequested: false
    }
  }
  componentDidUpdate (prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props !== prevProps) {
      this.setState({
        properties: this.props.properties,
        toggleRequested: false
      })
    }
  }

  handleChange = (key, e) => {
    let newState = _.cloneDeep(this.state)
    this.setState({
      ...newState,
      properties: {
        ...newState.properties,
        [key]: getStringValue(e.target.value)
      },
      toggleRequested: true
    })
  }

  render () {
    let content = []
    if (this.state.properties) {
      content = _.map(this.state.properties, (value, key) => {
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
                        this.handleChange(key, e)
                      }}
                      value={getStringValue(value)}
                    />
                    {console.log(this.state.properties[key])}
                    <ConfirmationButton
                      requested={this.state.toggleRequested}
                      requestIcon={<EditIcon />}
                      confirmIcon={<EditIcon deleteAction />}
                      onConfirmed={() => this.props.removeClick(key, value)}
                    />
                    <ConfirmationButton
                      requestIcon={<BinIcon />}
                      confirmIcon={<BinIcon deleteAction />}
                      onConfirmed={() => {
                        this.props.editEntityAction(
                          {
                            [this.props.node
                              ? 'nodeId'
                              : 'relationshipId']: this.props.node
                              ? this.props.node.identity.toInt()
                              : this.props.relationship.identity.toInt(),
                            [this.props.node ? 'label' : 'type']: this.props
                              .node
                              ? this.props.node.labels[0]
                              : this.props.relationship.type,
                            propertyKey: key
                          },
                          'delete',
                          this.props.node
                            ? 'nodeProperty'
                            : 'relationshipProperty'
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
        <p>{`There are no properties for this ${this.props.entityType}`}</p>
      )
    }

    return (
      <DrawerSection>
        <DrawerSubHeader>Properties</DrawerSubHeader>
        {content}
      </DrawerSection>
    )
  }
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
    </React.Fragment>
  )
}

DisplayNodeDetails.propTypes = {
  node: PropTypes.object,
  editEntityAction: PropTypes.func
}

export default DisplayNodeDetails
