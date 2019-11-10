import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Loader, Grid, Dimmer } from 'semantic-ui-react'

class CircleLoader extends Component {

  render() {
    return (
      <Grid textAlign='center' style={{ height: '40em' }}>
        <Grid.Column style={{ width: '60em' }} textAlign='left' verticalAlign='middle'>
            <Dimmer active inverted>
              <Loader inverted size='huge'>{this.props.text}</Loader>
            </Dimmer>
        </Grid.Column>
      </Grid>
    )
  }
}

export default CircleLoader
