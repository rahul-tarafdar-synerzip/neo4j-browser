import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { StyledTable, StyledKey, StyledValue } from '../DatabaseInfo/styled'
import CreatableSelect from 'react-select/creatable'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import {
  PlusIcon,
  CancelIcon,
  TickMarkIcon
} from 'browser-components/icons/Icons'
import styled from 'styled-components'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

const IconButton = styled.button`
  margin-left: 4px;
  border: 0;
  background: transparent;
  &:focus {
    outline: none;
  }
`

/**
 * Component to Create New Relationship
 */
export default function CreateRelationship (props) {
  const [direction, setDirection] = useState('')
  const [selectedType, setSelectedType] = useState(null)
  const [selectedLabel, setSelectedLabel] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  useEffect(
    () => {
      props.fetchSelectOptions('relationship', 'relationshipType')
      props.fetchSelectOptions('relationship', 'label')
      selectedLabel ? props.fetchSelectOptions('Node', selectedLabel.value) : ''
    },
    [selectedLabel]
  )
  return (
    <React.Fragment>
      <DrawerSection>
        <DrawerSectionBody>
          <StyledTable>
            <tbody>
              <tr>
                <StyledKey> Direction:</StyledKey>
                <StyledValue>
                  <FormControl
                    style={{
                      marginTop: 16,
                      marginBottom: 16,
                      minWidth: 120
                    }}
                    variant='outlined'
                  >
                    <Select
                      name='datatype'
                      style={{
                        background: '#fff',
                        fontSize: '14px',
                        textAlign: '-webkit-center',
                        height: '34px',
                        color: '#555',
                        borderTop: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                      value={direction}
                      onChange={e => {
                        setDirection(e.target.value)
                      }}
                    >
                      <MenuItem value='<----'>{'<---- (Incoming)'}</MenuItem>
                      <MenuItem value='---->'>{'----> (Outgoing)'}</MenuItem>
                    </Select>
                  </FormControl>
                </StyledValue>
              </tr>
              <tr>
                <StyledKey>Type:</StyledKey>
                <StyledValue
                  style={{ width: '100%' }}
                  data-testid='user-details-username'
                >
                  <CreatableSelect
                    isClearable
                    value={selectedType}
                    onChange={selectedType => {
                      setSelectedType(selectedType)
                    }}
                    options={props.relationshipTypeList}
                  />
                </StyledValue>
              </tr>
              <tr>
                <StyledKey>Label:</StyledKey>
                <StyledValue
                  style={{ width: '100%' }}
                  data-testid='user-details-username'
                >
                  <CreatableSelect
                    isClearable
                    value={selectedLabel}
                    onChange={selectedLabel => {
                      setSelectedLabel(selectedLabel)
                    }}
                    options={props.labelList}
                  />
                </StyledValue>
              </tr>
              <tr>
                <StyledKey>Node:</StyledKey>
                <StyledValue
                  style={{ width: '100%' }}
                  data-testid='user-details-username'
                >
                  <CreatableSelect
                    isClearable
                    value={selectedNode}
                    onChange={selectedNode => {
                      setSelectedNode(selectedNode)
                    }}
                    options={props.nodeList}
                  />
                </StyledValue>
              </tr>
            </tbody>
          </StyledTable>
          <ConfirmationButton
            requestIcon={
              <IconButton>
                <PlusIcon />
              </IconButton>
            }
            cancelIcon={
              <IconButton onClick={() => {}}>
                <CancelIcon />
              </IconButton>
            }
            confirmIcon={<TickMarkIcon />}
            onConfirmed={() => {
              props.editEntityAction(
                {
                  direction: direction,
                  startNodeId: props.node.identity.toInt(),
                  startNodeLabel: props.node.labels[0],
                  endNodeId: selectedNode.value.identity.toInt(),
                  endNodeLabel: selectedNode.value.labels[0],
                  relationshipType: selectedType.value
                },
                'create',
                'relationship'
              )
            }}
          />
        </DrawerSectionBody>
      </DrawerSection>
    </React.Fragment>
  )
}

CreateRelationship.propTypes = {
  labelList: PropTypes.array,
  relationshipTypeList: PropTypes.array,
  nodeList: PropTypes.array
}
