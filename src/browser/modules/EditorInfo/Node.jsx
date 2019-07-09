import React from 'react'
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
import { withState, withHandlers, compose } from 'recompose'

function Node ({ textField, handleToggle, handleChange, editEntityAction }) {
  return (
    <React.Fragment>
      <NewNodeButton onClick={() => handleToggle(!textField)} />
      {textField ? (
        <Drawer>
          <DrawerBody>
            <DrawerSection>
              <DrawerSectionBody>
                <StyledTable>
                  <StyledKey>Label:</StyledKey>
                  <StyledValue>
                    <TextInput
                      id='nodeLabel'
                      style={{
                        width: '120px'
                      }}
                      onChange={() => {
                        handleChange(([event.target.id] = event.target.value))
                      }}
                    />
                  </StyledValue>
                  <ConfirmationButton
                    requestIcon={<PlusIcon />}
                    confirmIcon={<TickMarkIcon doneAction />}
                    onConfirmed={editEntityAction}
                  />
                </StyledTable>
              </DrawerSectionBody>
            </DrawerSection>
          </DrawerBody>
        </Drawer>
      ) : null}
    </React.Fragment>
  )
}

const enhance = compose(
  withState('textField', 'handleToggle', false),
  withState('nodeLabel', 'handleChange', undefined),
  withHandlers({
    editEntityAction: props => () => {
      props.editEntityAction(
        {
          nodeLabel: props.nodeLabel
        },
        'create',
        'node'
      )
    }
  })
)
Node.propTypes = {
  editEntityAction: PropTypes.func
}

export default enhance(Node)
