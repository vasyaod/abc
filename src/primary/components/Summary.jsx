import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, Table, Container, Segment } from 'semantic-ui-react'

import { loadData }  from '../actions.js'
import { formatCurrency } from '../../countries.js'

class Summary extends Component {

  render() {
    return (
      <div>
        <p></p>
        <Table celled>
          <Table.Body>
            <Table.Row>
              <Table.Cell collapsing>Current month, { this.props.summary.currentMonthName }</Table.Cell>
              <Table.Cell>{ formatCurrency(this.props.countryId, this.props.summary.currentMonth) }</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>Last month, { this.props.summary.previousMonthName }</Table.Cell>
              <Table.Cell>{ formatCurrency(this.props.countryId, this.props.summary.previousMonth) }</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>Current year</Table.Cell>
              <Table.Cell>{ formatCurrency(this.props.countryId, this.props.summary.currentYear) }</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell collapsing>Last year</Table.Cell>
              <Table.Cell>{ formatCurrency(this.props.countryId, this.props.summary.previousYear) }</Table.Cell>
            </Table.Row>
            {/* <Table.Row>
              <Table.Cell collapsing>All the time</Table.Cell>
              <Table.Cell>{ this.props.summary.total }</Table.Cell>
            </Table.Row> */}
          </Table.Body>
        </Table>
        <p></p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    summary: state.summary,
    countryId: state.countryId
  }
}

export default connect(
  mapStateToProps,
  { loadData }
)(Summary)
