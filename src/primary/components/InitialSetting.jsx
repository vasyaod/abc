import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, Segment, Divider, Grid, Header, Checkbox, Dropdown, Message, Form } from 'semantic-ui-react'

import { loadData, changeCountry, changeCollectionData }  from '../actions.js'
import countries, { countryById } from '../../countries.js'

const countryOptions = countries.map(x => {return {
  key: x.id, value: x.id, flag: x.id.toLowerCase(), text: x.name + ' ' + "/" + ' ' + x.url
}})

class InitialSetting extends Component {

  render() {
    return (
      <Grid textAlign='center' style={{ height: '40em' }}>
        <Grid.Column width={6} textAlign='left' verticalAlign='middle'>
          <Form size="huge" warning>
            <Form.Field>
              <label>Is your country and Amazon site?</label>
              <Dropdown 
                fluid
                placeholder='Select your country' 
                selection 
                options = {countryOptions}
                value = {this.props.state.countryId == null ? "US" : this.props.state.countryId }
                onChange = {(event, data) => this.props.changeCountry(data.value)}
              />
              { (this.props.country && !this.props.country.supported) &&
                <Message
                      size='mini'
                      warning
                      header="This coutry is unchecked"
                      content="This country has not been checked properly and some functionality can be broken. If you see issue or don't see too, please, let us know."
                    />
              }
            </Form.Field>
            {/* <Form.Field>
              <Checkbox 
                checked = {this.props.state.collectData}
                onChange = {(event, data) => this.props.changeCollectionData(data.checked)}
                label = "The plugin doesn't send your data and statistics anywhere, but if you want to help us improve and anonymously share data with us, please check the box."
              />
            </Form.Field> */}
          </Form>
          <Divider hidden />
          <Button primary
                  size='huge'
                  style={{display: "block", margin: "0 auto" }} 
                  onClick={this.props.loadData}>
            Download & build report
          </Button>
          { this.props.state.isLoadingError &&
            <Message
              error
              header="Internet connection or parsing issue. Please try again."
              content={this.props.state.loadingError}
            />
          }
        </Grid.Column>
      </Grid>
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
  { loadData, changeCountry, changeCollectionData }
)(InitialSetting)
