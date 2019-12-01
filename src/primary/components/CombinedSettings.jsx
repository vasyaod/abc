import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Divider, Header, Segment } from 'semantic-ui-react'
import Settings from './Settings.jsx'
import Limits from './Limits.jsx'

class CombinedSettings extends Component {

  render() {
    return (
      <Segment attached='bottom'>
        <Header as='h5' attached='top' block>
          When limit is exceeded, the plugin will notify you.
        </Header>
        <Segment attached>
          <Limits/>
        </Segment>
        <Divider hidden />
        <Settings/>
      </Segment>
    );
  }
}

export default connect()(CombinedSettings)
