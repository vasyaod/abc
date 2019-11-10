import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Bar } from 'react-chartjs-2';

import { formatCurrency } from '../../countries.js'

class MonthlyChart extends Component {

  render() {
    return (
      <div>
        <Bar
          data={this.props.monthlyDataChartDatasets}
          width={100}
          height={50}
          options={{
            scales: {
              yAxes: [{
                ticks: {
                  // Include a dollar sign in the ticks
                  callback: (value, index, values) => {
                    return formatCurrency(this.props.countryId, value)
                  }
                }
              }]
            }
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    monthlyDataChartDatasets: state.monthlyDataChartDatasets,
    countryId: state.countryId
  }
}

export default connect(
  mapStateToProps
)(MonthlyChart)
