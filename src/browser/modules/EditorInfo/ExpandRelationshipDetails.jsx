import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { PropertiesSection } from './DisplayNodeDetails'
import { DrawerSubHeader } from 'browser-components/drawer/index'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import { StyledRelationship } from '../DatabaseInfo/styled'
import {
  BinIcon,
  ExpandMenuIcon,
  CollapseMenuIcon
} from 'browser-components/icons/Icons'
import { FoldersButton } from '../Sidebar/styled'
import {
  StyledList,
  StyledListHeaderItem,
  StyledFavFolderButtonSpan,
  EditFolderButton,
  FolderButtonContainer,
  StyledFolderLabel
} from '../Sidebar/styled'

/**
 * Component to Expand Relationship Details
 * @param {*} props
 */
export const ExpandRelationshipDetails = props => {
  const [active, setFlag] = useState(false)
  return (
    <div>
      <StyledList>
        <StyledListHeaderItem>
          <StyledFolderLabel>
            {props.relationshipEndpoint === 'from' && ' ----> '}
            {props.relationshipEndpoint === 'to' && ' <---- '}
            {/* displaying node ID */}
            {props.value.end.identity.toInt()}
          </StyledFolderLabel>
          <FolderButtonContainer>
            <FoldersButton onClick={() => setFlag(!active)}>
              {active === true ? <CollapseMenuIcon /> : <ExpandMenuIcon />}
            </FoldersButton>
            <EditFolderButton />
            &nbsp;
            <StyledFavFolderButtonSpan>
              <ConfirmationButton
                requestIcon={<BinIcon />}
                confirmIcon={<BinIcon deleteAction />}
                onConfirmed={() => {
                  // delete the relationship based on ID
                  props.editEntityAction(
                    {
                      relationshipId: props.value.segments[0].relationship.identity.toInt(),
                      nodeId: props.selectedNodeId
                    },
                    'delete',
                    'relationship'
                  )
                }}
              />
            </StyledFavFolderButtonSpan>
          </FolderButtonContainer>
          {active === true && (
            <div style={{ marginLeft: 30 }}>
              <DrawerSubHeader>Relationship Type</DrawerSubHeader>
              <StyledRelationship>
                {props.value.segments.map(
                  (item, index) => item.relationship.type
                )}
              </StyledRelationship>

              {props.value.segments.map((item, index) => (
                <PropertiesSection
                  properties={
                    item.relationship ? item.relationship.properties : null
                  }
                  {...props}
                  entityType='relationship'
                  editEntityAction={props.editEntityAction}
                />
              ))}
            </div>
          )}
        </StyledListHeaderItem>
      </StyledList>
    </div>
  )
}

ExpandRelationshipDetails.propTypes = {
  value: PropTypes.object,
  entityType: PropTypes.string,
  relationshipEndpoint: PropTypes.string,
  editEntityAction: PropTypes.func,
  selectedNodeId: PropTypes.number
}
