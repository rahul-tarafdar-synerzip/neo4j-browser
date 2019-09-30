import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  PlusIcon,
  TickMarkIcon,
  CancelIcon
} from 'browser-components/icons/Icons'
import {
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { RadioSelector } from 'browser-components/Form'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem'
import { v1 as neo4j } from 'neo4j-driver'
import { Calendar } from 'styled-icons/boxicons-regular/Calendar'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import { SpatialProperty } from './SpatialProperty'
import { StyledFavFolderButtonSpan } from '../Sidebar/styled'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'
import TextField from '@material-ui/core/TextField'

const IconButton = styled.div`
  margin-left: 4px;
  border: 0;
  background: transparent;
  &:focus {
    outline: none;
  }
`
export function DropDownContents (props) {
  return (
    <TextField
      style={{ flex: 1, marginTop: '8px', marginLeft: '16px' }}
      name='datatype'
      margin='dense'
      select
      label='Data Type'
      value={props.dataTypeValue}
      onChange={e => {
        props.handleChange(e.target.name, e.target.value)
        e.target.value !== 'date' && props.toggleCalendar(false)
      }}
      variant='outlined'
    >
      <MenuItem value='string'>String</MenuItem>
      <MenuItem value='number'>Number</MenuItem>
      <MenuItem value='boolean'>Boolean</MenuItem>
      <MenuItem value='date'>Date</MenuItem>
      <MenuItem value='spatial'>Spatial</MenuItem>
    </TextField>
  )
}

const dataTypeChecker = value => {
  if (neo4j.isInt(value[0])) {
    return 'number'
  }
  if (neo4j.isPoint(value[0])) {
    return 'spatial'
  }
  if (neo4j.isDate(value[0])) {
    return 'date'
  }
  if (typeof value[0] === 'string') {
    return 'string'
  }
  if (typeof value[0] === 'boolean') {
    return 'boolean'
  }
}

function Property (props) {
  const [textField, handleToggle] = useState(false)
  const [calendarFlag, toggleCalendar] = useState(false)
  const [showButtons, setButtonVisibility] = useState(false)
  const [dataType, setDatatype] = useState('')
  const [p, setP] = useState({ key: null, value: null })
  const [stateUpdatedWithProps, setFlag] = useState(false)
  const [entityType, setEntityType] = useState('')

  // effect to copy props to state. this is one time job
  useEffect(
    () => {
      if (!stateUpdatedWithProps) {
        setP(props.p)
        const dataTypeValue = dataTypeChecker(
          Object.values({ value: props.p && props.p.value })
        )
        setDatatype(dataTypeValue)
        if (props.relationshipId !== null) {
          setEntityType('relationship')
        } else {
          setEntityType('node')
        }
        setFlag(true)
      }
    },
    [props]
  )

  // effect to show confirmation buttons
  useEffect(
    () => {
      if (
        stateUpdatedWithProps &&
        props.p &&
        (props.p.value !== p.value || props.p.key !== p.key)
      ) {
        setButtonVisibility(true)
      } else {
        setButtonVisibility(false)
      }
    },
    [p && p.key, p && p.value, stateUpdatedWithProps]
  )

  const handleChange = (key1, value) => {
    setP({ ...p, value: value })
  }

  let valueInput = null
  const options = ['true', 'false']

  switch (dataType) {
    case 'string':
      valueInput = (
        <TextField
          margin='dense'
          variant='outlined'
          id='propValue'
          value={p.value || ''}
          onChange={e => {
            handleChange(e.target.id, e.target.value)
          }}
          style={{
            flex: 1,
            borderRadius: '5px'
          }}
        />
      )
      break
    case 'number':
      valueInput = (
        <TextField
          margin='dense'
          variant='outlined'
          id='propValue'
          type='number'
          value={p.value || ''}
          onChange={e => {
            handleChange(e.target.id, e.target.value)
          }}
          style={{
            flex: 1,
            borderRadius: '5px'
          }}
        />
      )
      break
    case 'boolean':
      valueInput = (
        <RadioSelector
          options={options}
          onChange={e => {
            handleChange('propValue', e.target.value)
          }}
          selectedValue={
            p
              ? Object.values({
                value: p.value !== null ? p.value : ''
              })[0].toString()
              : ''
          }
        />
      )
      break
    case 'date':
      valueInput = (
        <React.Fragment>
          <TextField
            margin='dense'
            variant='outlined'
            value={p.value || ''}
            disabled
            style={{
              flex: 1,
              borderRadius: '5px'
            }}
          />
          <Calendar
            style={{
              float: 'right',
              height: '2em',
              width: '2em',
              color: '#30333a'
            }}
            onClick={() => {
              toggleCalendar(!calendarFlag)
            }}
          />
        </React.Fragment>
      )
      break
    case 'spatial':
      valueInput = (
        <SpatialProperty
          properties={props.properties}
          value={p.value}
          onChange={point => {
            handleChange('propValue', point)
          }}
        />
      )
      break
  }

  const onConfirmed = () => {
    let filledFlag = true
    if (typeof p.value === 'object') {
      if (Object.values(p.value).includes(null || NaN)) {
        filledFlag = false
      }
    }
    if (p && p.key && p.value && filledFlag) {
      if (entityType === 'node') {
        props.editEntityAction(
          {
            nodeId: props.nodeId,
            key: p.key,
            value: p.value,
            oldProperties: Object.values(props.p)[0],
            dataType: dataType
          },
          'update',
          'nodeProperties'
        )
      } else if (entityType === 'relationship') {
        props.editEntityAction(
          {
            nodeId: props.nodeId,
            relationshipId: props.relationshipId,
            key: p.key,
            value: p.value,
            oldProperties: Object.values(props.p)[0],
            dataType: dataType
          },
          'update',
          'relationshipProperties'
        )
      }
      setButtonVisibility(false)
      dataType === 'date' && toggleCalendar(false)
    } else {
      alert('Empty field')
    }
  }

  const onCanceled = () => {
    setButtonVisibility(false)
    dataType === 'date' && toggleCalendar(false)
    setDatatype(dataTypeChecker(Object.values({ value: props.p.value })))
    setP(props.p)
  }

  return (
    <React.Fragment>
      {props.ToDisplay != 'view' ? (
        <StyledFavFolderButtonSpan>
          <ConfirmationButton
            requestIcon={
              <IconButton
                onClick={() => {
                  handleToggle(!textField)
                }}
              >
                <PlusIcon />
              </IconButton>
            }
            cancelIcon={
              <IconButton
                onClick={() => {
                  handleToggle(textField)
                  setP({ key: null, value: null })
                  setDatatype('')
                }}
              >
                <CancelIcon />
              </IconButton>
            }
            confirmIcon={<TickMarkIcon />}
            onConfirmed={() => {
              let filledFlag = true
              if (typeof p.value === 'object') {
                if (Object.values(p.value).includes(null || NaN)) {
                  filledFlag = false
                }
              }
              handleToggle(!textField)
              if (p && p.key && p.value && filledFlag) {
                if (entityType === 'node') {
                  props.editEntityAction(
                    {
                      id: props.id,
                      key: p.key,
                      value: p.value,
                      dataType: dataType
                    },
                    'create',
                    'nodeProperty'
                  )
                } else if (entityType === 'relationship') {
                  props.editEntityAction(
                    {
                      id: props.id,
                      relationshipId: props.relationshipId,
                      key: p.key,
                      value: p.value,
                      dataType: dataType
                    },
                    'create',
                    'relationshipProperty'
                  )
                }
                setP({ key: null, value: null })
                setDatatype('')
              } else {
                alert('Empty field')
              }
            }}
          />
        </StyledFavFolderButtonSpan>
      ) : null}
      {props.ToDisplay == 'view' || textField ? (
        <DrawerSection
          style={
            textField
              ? {
                marginLeft: -9,
                marginRight: -9,
                backgroundColor: '#efeff4',
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                marginBottom: 0,
                padding: 5
              }
              : {}
          }
        >
          {showButtons ? (
            <PartialConfirmationButtons
              onConfirmed={onConfirmed}
              onCanceled={onCanceled}
            />
          ) : null}
          <DrawerSectionBody
            style={{
              borderRadius: 5,
              padding: ' 0px 2px'
            }}
          >
            <div>
              <div style={{ display: 'flex' }}>
                <TextField
                  label='Key'
                  margin='dense'
                  variant='outlined'
                  id='key'
                  value={(p && p.key) || ''}
                  onChange={e => {
                    if (dataType === 'boolean') {
                      setP({
                        ...p,
                        value: p.value.toString(),
                        key: e.target.value
                      })
                    } else {
                      setP({ ...p, key: e.target.value })
                    }
                  }}
                  style={{
                    flex: 1,

                    borderRadius: '5px'
                  }}
                />

                <DropDownContents
                  style={{ flex: 1 }}
                  dataTypeValue={dataType}
                  handleChange={(key, value) => {
                    if (dataType !== value) {
                      setDatatype(value)
                      setP({ ...p, value: null })
                    }
                  }}
                  toggleCalendar={toggleCalendar}
                />
              </div>
              <div style={{ display: 'flex', color: '#30333a' }}>
                <div
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignSelf: 'center'
                  }}
                >
                  Value :
                </div>
                <div style={{ flex: 2, width: '100%' }}>
                  {valueInput}
                  {calendarFlag ? (
                    <DayPicker
                      style={{ float: 'right' }}
                      id='date'
                      onDayClick={day => {
                        handleChange(
                          'propValue',
                          neo4j.types.Date.fromStandardDate(day)
                        )
                      }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </DrawerSectionBody>
        </DrawerSection>
      ) : null}
    </React.Fragment>
  )
}

Property.propTypes = {
  editEntityAction: PropTypes.func
}

export default Property