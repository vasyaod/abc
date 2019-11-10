import React, { Component } from 'react';
import { connect } from 'react-redux'
//import { Button, List, Segment, Container, Divider, Icon, Menu, Grid, Header, Table, Select, Checkbox, Dropdown, Flag } from 'semantic-ui-react'
import DialogComponent from './DialogComponent.jsx'

class App extends Component {

  render() {
    return (
      <div>
        { this.props.isDialogActive &&
          <DialogComponent/>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isDialogActive: state.isDialogActive
  }
}

export default connect(
  mapStateToProps
)(App)
