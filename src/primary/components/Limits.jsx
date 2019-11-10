import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Table, Checkbox, Input } from 'semantic-ui-react'

import { switchMonthLimit, setMonthLimitValue }  from '../actions.js'

class Limits extends Component {

  render() {
    return (
      <div>
        <Table celled>
          <Table.Body>
            <Table.Row>
              <Table.Cell collapsing>
                <Checkbox 
                  toggle
                  checked = {this.props.isMonthLimitEnable}
                  onChange = {(event, data) => this.props.switchMonthLimit(data.checked)}
                />
              </Table.Cell>
              <Table.Cell>Monthly limit</Table.Cell>
              <Table.Cell collapsing>
                <Input 
                  value = {this.props.monthLimitValue}
                  onChange = {(event, data) => this.props.setMonthLimitValue(data.value)}
                />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isMonthLimitEnable: state.isMonthLimitEnable,
    monthLimitValue: state.monthLimitValue
  }
}

export default connect(
  mapStateToProps,
  { switchMonthLimit, setMonthLimitValue }
)(Limits)
