import React, { Component } from 'react';
import { connect } from 'react-redux'
import root from 'react-shadow';

import { cancel, proceedPurchase, openPlugin } from '../actions.js'

import { formatCurrency } from '../../countries.js'

const semanticCssUrl = chrome.runtime.getURL('./semantic.min.css');
const iconCssUrl = chrome.runtime.getURL('./icon.min.css');

class DialogComponent extends Component {

  render() {
    return (
      <div>
        <link rel="stylesheet prefetch" href={iconCssUrl.toString()}/>
        <root.div>
          <link rel="stylesheet" href={semanticCssUrl.toString()}/>
          <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100%", 
              width: "100%", 
              zIndex: 1000
            }}
            onWheel={(e) => {e.preventDefault()}}>
            <div class="ui active dimmer">
              <div class="ui basic active modal">
                <div class="ui icon header">
                  <i class="warning sign icon"></i>
                  Limit was achieved
                </div>
                <div class="content">
                  <p>{formatCurrency(this.props.countryId, this.props.spent)} were spent this month and your monthly limit of {formatCurrency(this.props.countryId, this.props.limit)} was exceeded. Are you sure you still want to proceed?</p>
                  <p align="right">You budget is protected by <a onClick={this.props.openPlugin} href="#">Budget Control Plugin</a></p>
                </div>
                <div class="actions">
                  <div class="ui basic cancel inverted button" onClick={this.props.proceedPurchase}>
                    <i class="checkmark icon"></i>
                    Proceed
                  </div>
                  <div class="ui red ok inverted button" onClick={this.props.cancel}>
                    <i class="remove icon"></i>
                    Cancel! Stop me, please!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </root.div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isDialogActive: state.isDialogActive,
    limit: state.limit,
    spent: state.spent,
    countryId: state.countryId
  }
}

export default connect(
  mapStateToProps,
  { cancel, proceedPurchase, openPlugin }
)(DialogComponent)

