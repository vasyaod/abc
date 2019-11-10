import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Progress, Grid, Dimmer } from 'semantic-ui-react'

class CircleLoader extends Component {

  render() {
    return (
      <Grid textAlign='center' style={{ height: '40em' }}>
        <Grid.Column style={{ width: '60em' }} textAlign='left' verticalAlign='middle'>
          <Progress percent={this.props.percent} indicating size='large'>
            {this.props.text}
          </Progress>
        </Grid.Column>
      </Grid>
    )
  }
}

export default CircleLoader
