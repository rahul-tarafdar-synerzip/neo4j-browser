/**
 * This component is used to accept the cartesian coordinates
 *
 */
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'

const styles = () => ({
  root: {
    display: 'flex'
  },
  style: {
    height: '34px',
    color: '#555',
    fontSize: '14px',
    padding: '6px 12px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '192px'
  },
  container: {
    display: 'unset'
  }
})

class CartesianSpatial extends React.Component {
  render() {
    const { classes } = this.props
    return (
      <>
        <div>
          X :<br />
          <Input
            style={{ width: '120px' }}
            className={classes.style}
            value={this.props.cartesianValue.X}
            onChange={e => {
              this.props.handleChange('cartesian-Spatial', e.target)
            }}
            id="X"
          />
        </div>
        <div>
          Y :<br />
          <Input
            style={{ width: '120px' }}
            className={classes.style}
            value={this.props.cartesianValue.Y}
            onChange={e => {
              this.props.handleChange('cartesian-Spatial', e.target)
            }}
            id="Y"
          />
        </div>
        <div>
          Z :<br />
          <Input
            style={{ width: '120px' }}
            className={classes.style}
            value={this.props.cartesianValue.Z}
            onChange={e => {
              this.props.handleChange('cartesian-Spatial', e.target)
            }}
            id="Z"
          />
        </div>
      </>
    )
  }
}

CartesianSpatial.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CartesianSpatial)
