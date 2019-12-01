import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Divider,Segment} from 'semantic-ui-react'
import Summary from './Summary.jsx'
import MonthlyChart from './MonthlyChart.jsx'

class Report extends Component {

  render() {
    return (
      <Segment attached='bottom'>
        <Summary/>
        <Divider hidden />
        <MonthlyChart/>
      </Segment>
    );
  }
}

export default connect()(Report)
