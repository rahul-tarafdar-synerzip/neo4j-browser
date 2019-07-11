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

export class CreateProperty extends Component {
  constructor (props) {
    super(props)

    this.state = {
      key: '',
      textField: false,
      calenderFlag: false,
      propertyType: undefined,
      values: {
        propValue: undefined,
        geographicValue: { latitude: '', longitude: '', height: '' },
        cartesianValue: { X: '', Y: '', Z: '' }
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
      textField: false,
      propValue: undefined,
      geographicValue: { latitude: '', longitude: '', height: '' },
      cartesianValue: { X: '', Y: '', Z: '' }
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
    let values = Object.assign({}, this.state.values)
    switch (id) {
      case 'key':
        this.setState({ key: value })
        break
      case 'number':
        values.propValue = value
        this.setState({ values })
        break
      case 'string':
        values.propValue = value
        this.setState({ values })
        break
      case 'geographical-Spatial':
        values.geographicValue[value.id] = value.value
        values.propValue = Object.entries(values.geographicValue)
        this.setState({ values })
        break
      case 'cartesian-Spatial':
        values.cartesianValue[value.id] = value.value
        values.propValue = Object.entries(values.cartesianValue)
        this.setState({ values })
        break
      case 'boolean':
        values.propValue = value
        this.setState({ values })
        break
      case 'date':
        values.propValue = value.toLocaleDateString()
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
    const options = ['true', 'false']
    switch (this.state.propertyType) {
      case 'number':
        propertyValueInput = (
          <TextInput
            style={{ width: '120px' }}
            id='number'
            onChange={e => {
              this.handleChange(e.target.id, e.target.value)
            }}
            value={this.state.values.propValue}
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
              value={this.state.values.propValue}
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
            style={{ width: '120px' }}
            id='string'
            onChange={e => {
              this.handleChange(e.target.id, e.target.value)
            }}
            value={this.state.values.propValue}
          />
        )
        break
      case 'geographical-Spatial':
        propertyValueInput = (
          <GeographicSpatial
            handleChange={this.handleChange}
            geographicValue={this.state.values.geographicValue}
          />
        )
        break
      case 'cartesian-Spatial':
        propertyValueInput = (
          <CartesianSpatial
            handleChange={this.handleChange}
            cartesianValue={this.state.values.cartesianValue}
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
            selectedValue={this.state.values.propValue}
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
                            style={{ width: '120px' }}
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
                        confirmIcon={<BinIcon deleteAction />}
                        onConfirmed={() =>
                          this.props.editEntityAction(
                            {
                              key: this.state.key,
                              value: this.state.values.propValue
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

export default CreateProperty
