import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Segment, Header, Checkbox, Dropdown, Message, Button } from 'semantic-ui-react'

import { loadData, changeCountry, changeCollectionData, resetState }  from '../actions.js'
import countries, { countryById } from '../../countries.js'

const countryOptions = countries.map(x => {return {
  key: x.id, value: x.id, flag: x.id.toLowerCase(), text: x.name + ' ' + "/" + ' ' + x.url
}})

class Settings extends Component {

  render() {
    return (
      <div>
        <Header as='h5' attached='top' block>
          Is your region and Amazon site?
        </Header>
        <Segment attached>
          <Dropdown 
            fluid
            placeholder='Select your country' 
            selection 
            options = {countryOptions}
            value = {this.props.state.countryId == null ? "US" : this.props.state.countryId}
            onChange = {(event, data) => this.props.changeCountry(data.value)}
          />
        </Segment>
        { (this.props.country && !this.props.country.supported) &&
          <Message 
                attached='bottom'
                warning
                header="This coutry is unchecked"
                content="This country has not been checked properly and some functionality can be broken. If you see issue or don't see too, please, let us know."
              />
        }

        <Header as='h5' attached='top' block>
          We don't send your data and statistics anywhere, but if you want to help us improve and anonymously share data with us, please flip the button.
        </Header>
        <Segment attached>
          <Checkbox 
            toggle
            checked = {this.props.state.collectData}
            onChange = {(event, data) => this.props.changeCollectionData(data.checked)}
          />
        </Segment>

        <Header as='h5' attached='top' block>
          Reset cache and reload the report
        </Header>
        <Segment attached>
          <Button 
            color='blue'
            onClick={this.props.resetState}>
            Reset 
          </Button>
        </Segment>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    state: state,
    country: state.country
  }
}

export default connect(
  mapStateToProps,
  { loadData, changeCountry, changeCollectionData, resetState }
)(Settings)
