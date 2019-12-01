import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, List, Segment, Container, Divider, Icon, Menu, Grid, Header, Table, Select, Checkbox, Dropdown, Flag } from 'semantic-ui-react'
import Report from './Report.jsx'
import Orders from './Orders.jsx'
import InitialSetting from './InitialSetting.jsx'
import CircleLoader from './CircleLoader.jsx'
import LoadingProgress from './LoadingProgress.jsx'
import CombinedSettings from './CombinedSettings.jsx'

import { loadData, shareFacebook, shareTwitter }  from '../actions.js'

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = { activeItem: 'report' }
  }

  handleItemClick (e, { name }) {
    this.setState({ activeItem: name })
  }

  componentDidMount() {
    // const parameters = queryString.parse(location.search)
    // if (parameters.project != null) {
    //   this.props.dispatch(loadProjectFromUrl(parameters.project))
    // }
  }

  render() {
    return (
      <div>
        { this.props.state.isCountryCheck &&
          <CircleLoader text="Detection of country"/>
        }
        { !this.props.state.isCountryCheck &&
          <div>
            { (!this.props.state.isDataLoaded && !this.props.state.loadingStatus)&&
              <InitialSetting/>
            }
            { (!this.props.state.isDataLoaded && this.props.state.loadingStatus) &&
              <LoadingProgress
                percent={this.props.state.loadingStatus.percent}
                text={this.props.state.loadingStatus.text}
              />
            }
            { this.props.state.isDataLoaded &&
              <Grid textAlign='center' style={{ height: '40em' }}>
                <Grid.Column style={{ width: '60em' }} textAlign='left'>
                  <Segment basic>
                    <Menu attached='top' tabular>
                      <Menu.Item name='report' active={this.state.activeItem === 'report'} onClick={this.handleItemClick.bind(this)}>
                        Report
                      </Menu.Item>
                      <Menu.Item name='orders' active={this.state.activeItem === 'orders'} onClick={this.handleItemClick.bind(this)}>
                        Orders
                      </Menu.Item>
                      <Menu.Item name='settings' active={this.state.activeItem === 'settings'} onClick={this.handleItemClick.bind(this)}>
                        Limits & Settings
                      </Menu.Item>
                      <Menu.Menu position='right'>
                        <Menu.Item>
                          { this.props.state.refreshDate &&
                            <span>report by {monthNames[this.props.state.refreshDate.getMonth()]} {this.props.state.refreshDate.getDate()}</span>
                          }
                        </Menu.Item>
                        <Menu.Item>
                          <Button 
                            basic
                            color='blue'
                            onClick={this.props.loadData}
                            loading={this.props.state.loadingStatus != null}>                            
                              { this.props.state.isLoadingError &&
                                <span>
                                  <Icon name='refresh'/>
                                  Some error. Try again.
                                </span>
                              }
                              { !this.props.state.isLoadingError &&
                                <span>
                                  <Icon name='refresh'/>
                                  Refresh data
                                </span>
                              }
                          </Button>
                        </Menu.Item>
                      </Menu.Menu>
                    </Menu>
                    {this.state.activeItem === 'report' && <Report/>}
                    {this.state.activeItem === 'orders' && <Orders/>}
                    {this.state.activeItem === 'settings' && <CombinedSettings/>}
                  </Segment>
                  {/* <Segment basic>
                    <iframe width="100%" height="340px" src="https://abc.f-proj.com/ad.html?terms=acid aging hyaluronic door serum wrinkle vitamin retinol lock leather&title=Ads" frameBorder="0"></iframe>
                  </Segment> */}
                </Grid.Column>
              </Grid>
            } 
            <Menu fixed='bottom' inverted>
              <Container text>
                <Menu.Item href='https://github.com/vasyaod/abc/issues'>
                  <Icon name='github'/> Report issue on Github
                </Menu.Item>
                <Menu.Item color='facebook' onClick={this.props.shareFacebook}>
                  <Icon name='facebook'/> Share on Facebook
                </Menu.Item>
                <Menu.Item color='twitter' onClick={this.props.shareTwitter}>
                  <Icon name='twitter'/> Share on Twitter
                </Menu.Item>
              </Container>
            </Menu>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    state: state
  }
}

export default connect(
  mapStateToProps,
  { loadData, shareFacebook, shareTwitter }
)(Page)
