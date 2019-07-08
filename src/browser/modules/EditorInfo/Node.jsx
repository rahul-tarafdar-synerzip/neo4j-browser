import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyledTable, StyledValue, StyledKey } from '../DatabaseInfo/styled'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import { PlusIcon, TickMarkIcon } from 'browser-components/icons/Icons'
import { NewNodeButton } from '../Sidebar/styled'
import {
  Drawer,
  DrawerBody,
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { TextInput } from 'browser-components/Form'
class Node extends Component {
  state = {
    nodeLabel: undefined,
    textField: false
  }

  handleToggle = () => {
    this.setState({
      textField: !this.state.textField
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  render () {
    return (
      <React.Fragment>
        <NewNodeButton onClick={this.handleToggle} />
        {this.state.textField === true ? (
          <Drawer>
            <DrawerBody>
              <DrawerSection>
                <DrawerSectionBody>
                  <StyledTable>
                    <tbody>
                      <tr>
                        <StyledKey>Label:</StyledKey>
                        <StyledValue>
                          <TextInput
                            id='nodeLabel'
                            style={{
                              width: '120px'
                            }}
                            onChange={this.handleChange}
                          />
                        </StyledValue>
                        <ConfirmationButton
                          requestIcon={<PlusIcon />}
                          confirmIcon={<TickMarkIcon doneAction />}
                          onConfirmed={() =>
                            this.props.editEntityAction(
                              undefined,
                              this.state.nodeLabel,
                              'create',
                              'node'
                            )
                          }
                        />
                      </tr>
                    </tbody>
                  </StyledTable>
                </DrawerSectionBody>
              </DrawerSection>
            </DrawerBody>
          </Drawer>
        ) : null}
      </React.Fragment>
    )
  }
}

Node.propTypes = {
  editEntityAction: PropTypes.func
}

export default Node
