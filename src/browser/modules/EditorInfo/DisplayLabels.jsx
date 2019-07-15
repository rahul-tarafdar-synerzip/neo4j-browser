import React, { useState, useEffect } from 'react'
import { BinIcon, TickMarkIcon } from 'browser-components/icons/Icons'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'
import { getStringValue } from './utils'
import { StyledValue } from '../DatabaseInfo/styled'
import { StyledKeyEditor, EditPropertiesInput } from './styled'
import PropTypes from 'prop-types'

/**
 * Component to display the label of selected node
 * @param {*} props
 */

export const DisplayLabels = props => {
  let { labels, labelsKey } = props

  const initialState = {
    labelNames: { [labelsKey]: labels },
    requested: false
  }
  const [labelsState, setToInitialState] = useState(initialState)

  useEffect(() => {
    setToInitialState({
      labelNames: { [labelsKey]: labels },
      requested: false
    })
  }, [labels])

  const handleChange = (event, labelsKey) => {
    let newState = _.cloneDeep(labelsState)
    setToInitialState({
      ...newState,
      labelNames: {
        ...newState.labelNames,
        [labelsKey]: getStringValue(event.target.value)
      },
      requested: true
    })
  }

  const onCanceled = () => {
    setToInitialState({
      labelNames: { [labelsKey]: labels },
      requested: false
    })
  }

  return (
    <React.Fragment>
      <StyledKeyEditor>{labelsKey}:</StyledKeyEditor>
      <StyledValue data-testid='user-details-username'>
        <EditPropertiesInput
          type='text'
          value={getStringValue(labelsState.labelNames[labelsKey])}
          onChange={event => {
            handleChange(event, labelsKey)
          }}
        />
        {labelsState.requested ? (
          <PartialConfirmationButtons
            icon={<TickMarkIcon />}
            onCanceled={onCanceled}
          />
        ) : null}
        <ConfirmationButton
          requestIcon={<BinIcon />}
          confirmIcon={<BinIcon deleteAction />}
          //  onConfirmed={onCanceled}
        />
      </StyledValue>
    </React.Fragment>
  )
}

DisplayLabels.propTypes = {
  labelsKey: PropTypes.string,
  labels: PropTypes.string
}
