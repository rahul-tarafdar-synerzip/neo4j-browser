import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MaskedInput from 'react-text-mask'
import { TextInput } from 'browser-components/Form'

function TextMaskCustom (props) {
  const { inputRef, ...other } = props

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null)
      }}
      mask={[/[1-9]/, /\d/, '.', /\d/, /\d/]}
      showMask
    />
  )
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired
}

function AddSpatialProperty (props) {
  const initialState = {
    newProperties: {}
  }
  const [myState, updatePropertiesState] = useState(initialState)

  const handleSpatialChange = (key1, value) => {
    let newState = _.cloneDeep(myState)
    updatePropertiesState({
      ...newState,
      newProperties: {
        ...newState.newProperties,
        [key1]: value
      }
    })
  }

  let valueInput = null
  switch (myState.newProperties.datatype) {
    case 'cartesian2D':
      valueInput = (
        <React.Fragment>
          X:
          <TextInput
            id='x'
            type='number'
            onChange={e => {
              props.handleCartesian(
                e.target.id,
                parseFloat(e.target.value),
                7203
              )
            }}
            style={{ width: '120px' }}
          />
          Y:
          <TextInput
            id='y'
            type='number'
            onChange={e => {
              props.handleCartesian(
                e.target.id,
                parseFloat(e.target.value),
                7203
              )
            }}
            style={{ width: '120px' }}
          />
        </React.Fragment>
      )
      break
    case 'cartesian3D':
      valueInput = (
        <React.Fragment>
          X:
          <TextInput
            id='x'
            type='number'
            onChange={e => {
              props.handleCartesian(
                e.target.id,
                parseFloat(e.target.value),
                9157
              )
            }}
            style={{ width: '120px' }}
          />
          Y:
          <TextInput
            id='y'
            type='number'
            onChange={e => {
              props.handleCartesian(
                e.target.id,
                parseFloat(e.target.value),
                9157
              )
            }}
            style={{ width: '120px' }}
          />
          Z:
          <TextInput
            id='z'
            type='number'
            onChange={e => {
              props.handleCartesian(
                e.target.id,
                parseFloat(e.target.value),
                9157
              )
            }}
            style={{ width: '120px' }}
          />
        </React.Fragment>
      )
      break
    case 'geographic2D':
      valueInput = (
        <React.Fragment>
          Longitude/X :
          <Input
            style={{
              width: '120px',
              color: '#555',
              backgroundColor: '#fff',
              padding: '4px 12px',
              fontSize: '12px'
            }}
            onChange={e => {
              props.handleCartesian(
                e.target.id,
                parseFloat(e.target.value),
                4326
              )
            }}
            id='x'
            inputComponent={TextMaskCustom}
          />
          Latitude/Y :
          <Input
            style={{
              width: '120px',
              color: '#555',
              backgroundColor: '#fff',
              padding: '4px 12px',
              fontSize: '12px'
            }}
            onChange={e => {
              props.handleCartesian(
                e.target.id,
                parseFloat(e.target.value),
                4326
              )
            }}
            id='y'
            inputComponent={TextMaskCustom}
          />
        </React.Fragment>
      )
      break
    case 'geographic3D':
      valueInput = (
        <React.Fragment>
          Longitude/X :
          <Input
            style={{
              width: '120px',
              color: '#555',
              backgroundColor: '#fff',
              padding: '4px 12px',
              fontSize: '12px'
            }}
            onChange={e => {
              props.handleCartesian(
                e.target.id,
                parseFloat(e.target.value),
                4979
              )
            }}
            id='x'
            inputComponent={TextMaskCustom}
          />
          Latitude/Y :
          <Input
            style={{
              width: '120px',
              color: '#555',
              backgroundColor: '#fff',
              padding: '4px 12px',
              fontSize: '12px'
            }}
            onChange={e => {
              props.handleCartesian(
                e.target.id,
                parseFloat(e.target.value),
                4979
              )
            }}
            id='y'
            inputComponent={TextMaskCustom}
          />
          Height/Z :
          <Input
            style={{
              width: '120px',
              color: '#555',
              backgroundColor: '#fff',
              padding: '4px 12px',
              fontSize: '12px'
            }}
            onChange={e => {
              props.handleCartesian(
                e.target.id,
                parseFloat(e.target.value),
                4979
              )
            }}
            id='z'
            inputComponent={TextMaskCustom}
          />
        </React.Fragment>
      )
      break
  }
  return (
    <React.Fragment>
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
          value={myState.newProperties.datatype}
          onChange={e => {
            handleSpatialChange(e.target.name, e.target.value)
          }}
        >
          <MenuItem value='cartesian2D'>Cartesian-2D</MenuItem>
          <MenuItem value='cartesian3D'>Cartesian-3D</MenuItem>
          <MenuItem value='geographic2D'>Geographic-2D</MenuItem>
          <MenuItem value='geographic3D'>Geographic-3D</MenuItem>
        </Select>
      </FormControl>
      {valueInput}
    </React.Fragment>
  )
}

AddSpatialProperty.propTypes = {
  editEntityAction: PropTypes.func
}

export default AddSpatialProperty
