import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Divider } from 'semantic-ui-react'
import Summary from './Summary.jsx'
import MonthlyChart from './MonthlyChart.jsx'

class Report extends Component {

  render() {
    return (
      <div>
        <Summary/>
        <Divider hidden />
        <MonthlyChart/>
      </div>
    );
  }
}

export default connect()(Report)
