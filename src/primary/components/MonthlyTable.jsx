import React, { Component } from 'react';
import { connect } from 'react-redux'

class MonthlyChart extends Component {

  render() {
    return (
      <div>
        { this
            .props
            .monthlyData
            .map(x =>
              <p key={x.month}>{x.month}, {x.amount}</p>
            )
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    monthlyData: state.monthlyData
  }
}

export default connect(
  mapStateToProps
)(MonthlyChart)
