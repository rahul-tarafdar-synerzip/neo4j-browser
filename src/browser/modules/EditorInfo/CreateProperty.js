/**
 * This component is used to render the textfields to accept
 * the new properties in key-value pair for node/relationship.
 */
import React, { Component } from 'react'
import { Drawer, DrawerBody, DrawerSection } from 'browser-components/drawer'
import { TextInput, RadioSelector } from 'browser-components/Form'
import {
  DrawerSectionBody,
  DrawerFooter
} from 'browser-components/drawer/index'
import GeographicSpatial from './GeographicSpatial'
import CartesianSpatial from './CartesianSpatial'
import DropDownContents from './DropDownContents'
import { StyledKey, StyledValue } from '../DatabaseInfo/styled'
import { StyledTable } from '../Stream/Queries/styled'
import { Calendar } from 'styled-icons/boxicons-regular/Calendar'
import { PlusIcon, BinIcon } from 'browser-components/icons/Icons'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'

function DatePicker (props) {
  return (
    <DayPicker
      style={{ float: 'right' }}
      id='date'
      onDayClick={day => {
        props.onDatePropSelect('date', day)
      }}
    />
  )
}

export class AddProperty extends Component {
  constructor (props) {
    super(props)

    this.state = {
      key: '',
      textField: false,
      calenderFlag: false,
      propertyType: undefined,
      date: new Date().toLocaleDateString(),
      values: {
        validFlag: false,
        numCheck: false,
        boolValue: false,
        textValue: '',
        numberValue: '',
        selectedDate: {
          year: new Date().getFullYear,
          month: new Date().getMonth,
          day: new Date().getDate
        },
        geographicValue: { index: '', latitude: '', longitude: '', height: '' },
        cartesianValue: { index: '', X: '', Y: '', Z: '' }
      }
    }
  }

  handleToggle = () => {
    this.setState({
      textField: !this.state.textField
    })
  }

  /**
   * This method is used to initialize the state and is invoked on change of property datatype.
   */
  getInitState = () => {
    let values = {
      validFlag: false,
      textField: false,
      numCheck: false,
      boolValue: false,
      textValue: '',
      numberValue: '',
      selectedDate: {
        year: new Date().getFullYear,
        month: new Date().getMonth,
        day: new Date().getDate
      },
      geographicValue: { index: '', latitude: '', longitude: '', height: '' },
      cartesianValue: { index: '', X: '', Y: '', Z: '' }
    }
    return values
  }

  /**
   * This method is used to toggle the calender display on icon click
   */

  toggleCalender = () => {
    this.setState({
      calenderFlag: !this.state.calenderFlag
    })
  }

  /**
   * This method changes the component state.
   */
  handleChange = (id, value) => {
    const latitudeRegEx = /^[0-9\b.]+$/
    let values = Object.assign({}, this.state.values)
    switch (id) {
      case 'key':
        this.setState({ key: value })
        break
      case 'number':
        const numberRegEx = /^[0-9\b]+$/
        values.numberValue = value
        if (values.numberValue === '') {
          values.validFlag = false
          values.numCheck = false
        } else {
          numberRegEx.test(value)
            ? (values.numCheck = true)
            : (values.numCheck = false)
          values.validFlag = true
        }
        this.setState({ values })
        break
      case 'string':
        values.textValue = value
        values.numCheck = true
        values.textValue === ''
          ? (values.validFlag = false)
          : (values.validFlag = true)
        this.setState({ values })
        break
      case 'geographical-Spatial':
        values.geographicValue.latitude !== '' &&
        values.geographicValue.longitude !== ''
          ? (values.validFlag = true)
          : (values.validFlag = false)
        if (value.id === 'height' && value.value === '__.__') {
          ;(values.validFlag = true), (values.numCheck = true)
        } else {
          latitudeRegEx.test(value.value)
            ? (values.numCheck = true)
            : (values.numCheck = false)
        }
        values.geographicValue[value.id] = value.value
        this.setState({ values })
        break
      case 'cartesian-Spatial':
        values.cartesianValue[value.id] = value.value
        values.cartesianValue.X !== '' && values.cartesianValue.Y !== ''
          ? (values.validFlag = true)
          : (values.validFlag = false)
        if (value.id === 'Z' && value.value === '') {
          ;(values.validFlag = true), (values.numCheck = true)
        } else {
          latitudeRegEx.test(value.value)
            ? (values.numCheck = true)
            : (values.numCheck = false)
        }
        this.setState({ values })
        break
      case 'boolean':
        values.boolValue = value
        values.validFlag = true
        values.numCheck = true
        this.setState({ values })
        break
      case 'date':
        this.setState({ date: value.toLocaleDateString() })
        let newDate = new Date(value)
        values.selectedDate.year = newDate.getUTCFullYear()
        values.selectedDate.month = 1 + newDate.getUTCMonth()
        values.selectedDate.day = newDate.getUTCDate()
        values.validFlag = true
        values.numCheck = true
        this.setState({ values })
        break
      default:
        break
    }
  }

  /**
   * This method used for setting the property datatype and
   * based on the selected property type, input components are rendered.
   */
  onPropertyTypeSelect = propertyType => {
    let values = _.cloneDeep(this.state.values)
    values = this.getInitState()
    this.setState({ values, propertyType })
  }

  render () {
    let propertyValueInput = null
    let textStyle = {
      borderColor: 'crimson',
      borderWidth: '2px',
      width: '120px'
    }
    let validStyle = {
      borderColor: 'green',
      borderWidth: '2px',
      width: '120px'
    }
    const options = ['true', 'false']
    switch (this.state.propertyType) {
      case 'number':
        propertyValueInput = (
          <TextInput
            style={this.state.values.numCheck ? { width: '120px' } : textStyle}
            id='number'
            onChange={e => {
              this.handleChange(e.target.id, e.target.value)
            }}
            value={this.state.values.numberValue}
          />
        )
        break
      case 'date':
        propertyValueInput = (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <TextInput
              style={{
                width: '120px'
              }}
              value={this.state.date}
              disabled
            />
            <Calendar
              style={{
                float: 'right',
                height: '2em',
                width: '2em',
                color: 'ghostwhite'
              }}
              onClick={this.toggleCalender}
            />
          </div>
        )
        break
      case 'string':
        propertyValueInput = (
          <TextInput
            style={{
              width: '120px'
            }}
            id='string'
            onChange={e => {
              this.handleChange(e.target.id, e.target.value)
            }}
            value={this.state.values.textValue}
          />
        )
        break
      case 'geographical-Spatial':
        propertyValueInput = (
          <GeographicSpatial
            handleChange={this.handleChange}
            geographicValue={this.state.values.geographicValue}
            numCheck={this.state.values.numCheck}
          />
        )
        break
      case 'cartesian-Spatial':
        propertyValueInput = (
          <CartesianSpatial
            handleChange={this.handleChange}
            cartesianValue={this.state.values.cartesianValue}
            numCheck={this.state.values.numCheck}
          />
        )
        break
      case 'boolean':
        propertyValueInput = (
          <RadioSelector
            id='boolean'
            options={options}
            onChange={e => {
              this.handleChange('boolean', e.target.value)
            }}
            selectedValue={this.state.values.boolValue}
          />
        )
        break
      default:
        null
    }
    return (
      <React.Fragment>
        <div onClick={this.handleToggle}>
          <PlusIcon />
          New Property
        </div>
        {this.state.textField === true ? (
          <Drawer>
            <DrawerBody>
              <DrawerSection>
                <DrawerSectionBody>
                  <StyledTable>
                    <tbody>
                      <tr>
                        <StyledKey>key:</StyledKey>
                        <StyledValue>
                          <TextInput
                            id='key'
                            onChange={e => {
                              this.handleChange(e.target.id, e.target.value)
                            }}
                            style={{
                              width: '120px'
                            }}
                          />
                        </StyledValue>
                      </tr>
                      <tr>
                        <StyledKey> Data Type:</StyledKey>
                        <StyledValue>
                          <DropDownContents
                            value={this.state.propertyType}
                            onSelect={this.onPropertyTypeSelect}
                          />
                        </StyledValue>
                      </tr>
                      <tr style={{ verticalAlign: '-webkit-baseline-middle' }}>
                        <StyledKey>Value :</StyledKey>
                        <StyledValue>{propertyValueInput}</StyledValue>
                      </tr>
                      <tr>
                        {this.state.calenderFlag ? (
                          <DatePicker onDatePropSelect={this.handleChange} />
                        ) : null}
                      </tr>
                      <ConfirmationButton
                        requestIcon={<PlusIcon />}
                        confirmIcon={<BinIcon doneAction />}
                        onConfirmed={() =>
                          this.props.editEntityAction(
                            {
                              key: this.state.key,
                              value: this.state.values.textValue
                            },
                            'create',
                            'node'
                          )
                        }
                      />
                    </tbody>
                  </StyledTable>
                </DrawerSectionBody>
              </DrawerSection>
              <DrawerFooter />
            </DrawerBody>
          </Drawer>
        ) : null}
      </React.Fragment>
    )
  }
}

export default AddProperty
