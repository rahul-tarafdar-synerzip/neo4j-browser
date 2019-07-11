/**
 * This component is used to display the property data types in dropdown.
 * Based on the selected data type, corresponding elements are rendered.
 *
 */
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
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
  formControl: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    minWidth: 120
  },
  drop: {
    background: '#fff',
    fontSize: '14px',
    textAlign: '-webkit-center',
    height: '34px',
    color: '#555',
    borderTop: '1px solid #ccc',
    borderRadius: '4px'
  }
})

class DropDownContents extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <FormControl className={classes.formControl} variant='outlined'>
        <Select
          className={classes.drop}
          value={this.props.value}
          onChange={e => {
            this.props.onSelect(e.target.value)
          }}
          inputProps={{
            name: 'datatype-2',
            id: 'datatype'
          }}
        >
          <MenuItem value='number'>Numbers</MenuItem>
          <MenuItem value='boolean'>Boolean</MenuItem>
          <MenuItem value='string'>String</MenuItem>
          <MenuItem value='date'>Date</MenuItem>
          <MenuItem value='geographical-Spatial'>Geographical-Spatial</MenuItem>
          <MenuItem value='cartesian-Spatial'>Cartesian-Spatial</MenuItem>
        </Select>
      </FormControl>
    )
  }
}

export default withStyles(styles)(DropDownContents)
