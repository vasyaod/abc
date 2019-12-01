import React, {Component, createRef} from 'react';
import { connect } from 'react-redux'
import { Card, Icon, Image, Header, Sticky, Ref, Segment } from 'semantic-ui-react'
import { List } from 'immutable'

class Orders extends Component {
  
  contextRef = createRef()
  
  render() {
    return (
      <>
        {
          this.props.items.map( (items, key1) =>
              <> 
                <div ref={this.contextRef} className="attached"/>
                <Sticky context={this.contextRef} >
                    <Header as='h2' className="ui attached">
                      {key1}
                    </Header>
                </Sticky>
                <Segment attached>
                  <Card.Group itemsPerRow={3}>
                    {
                      items.map( item => 
                        <Card href={`https://${this.props.country.url}/gp/product/${item.asin}`}>
                          <div style={{height: '17em', overflow: 'hidden', backgroundColor: "#fff", position: "relative"}}>
                            <Image
                              style={{left: 0, right: 0, top: 0, bottom: 0, margin: 'auto', position: "absolute"}}
                              src={`https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=${this.props.countryId}&ASIN=${item.asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=SL250`}
                              srcSet='https://react.semantic-ui.com/images/wireframe/image.png 2x'
                              onError={i => i.target.src='images/not-found.png' }
                            ></Image>
                          </div>
                          <Card.Content>
                            <Card.Description>
                              {item.title}
                            </Card.Description>
                          </Card.Content>
                        </Card>
                      )
                    }
                  </Card.Group>
                </Segment>
              </>
          )
          .toList()
        }
      </>
    );
  }
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function monthByIndex(index) {
  if (index < 0) {
    index = 12 + index
  }
  return monthNames[index]
}

const mapStateToProps = (state) => {
  return {
    items: 
      List(state.orders)
        .sortBy(e => e.orderDate)
        .reverse()
        .groupBy(order => monthByIndex(order.orderDate.getMonth()) + ", " + order.orderDate.getFullYear())
        .map(orders => orders.flatMap(order => order.items)),
    countryId: state.countryId,
    country: state.country,
  }
}

export default connect(
  mapStateToProps
)(Orders)