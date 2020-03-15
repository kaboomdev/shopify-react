import { BrowserRouter as Router, Route } from "react-router-dom";
import React, { Component } from "react";

import { graphql } from 'react-apollo';
import * as compose from 'lodash.flowright';
import { createCheckout, checkoutLineItemsReplace } from "./checkout";



import Product from "./templates/product";
import Cart from "./templates/cart";

class App extends Component {
  constructor() {
    super();
    this.state = {
      checkout: {},
      lineItems: [],
      storedLineItems: [],
      cartOpen: false,
    }

    this.addVariant = this.addVariant.bind(this);
    this.toggleCart = this.toggleCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
  }

  componentDidMount() {
    const lineItems = localStorage.react_store_checkout_items ?
      JSON.parse(localStorage.getItem("react_store_checkout_items")) :
      [];

    this.props.createCheckout({
      variables: {
        input: {
          lineItems: lineItems
        }
      }
    }).then((res => {
      this.setState({
        checkout: res.data.checkoutCreate.checkout,
        lineItems: res.data.checkoutCreate.checkout.lineItems.edges
      })
    }))
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.lineItems != this.state.lineItems) {
      const storedLineItems = this.addLineItemsToStorage(this.state.lineItems);
      this.setState({ storedLineItems: storedLineItems });
    }
  }

  addVariant(variantId) {
    const lineItems = this.state.storedLineItems.find(item => item.variantId === variantId) ?
      this.state.storedLineItems.map(item => ({
        ...item, quantity: item.variantId === variantId ? item.quantity + 1 : item.quantity
      })) : [...this.state.storedLineItems, { "variantId": variantId, "quantity": 1 }];


    this.props.checkoutLineItemsReplace({
      variables: {
        checkoutId: this.state.checkout.id,
        lineItems: lineItems,
      }
    }).then(res => this.setState({
      checkout: res.data.checkoutLineItemsReplace.checkout,
      lineItems: res.data.checkoutLineItemsReplace.checkout.lineItems.edges
    }))
  }
  
  clearCart(){
    this.props.checkoutLineItemsReplace({
      variables: {
        checkoutId: this.state.checkout.id, 
        lineItems: [],
      }
    }).then(res=>this.setState({
      checkout: res.data.checkoutLineItemsReplace.checkout,
      lineItems: res.data.checkoutLineItemsReplace.checkout.lineItems.edges
    }))
  }
  
  cartQuantity(){
    return this.state.lineItems.reduce((acc, next)=>{
      acc += next.node.quantity;
      return acc;
    }, 0);
  }

  addLineItemsToStorage(lineItems) {
    const lineItemsMapped = lineItems.map(item => ({
      variantId: item.node.variant.id,
      quantity: item.node.quantity
    }));
    localStorage.setItem('react_store_checkout_items', JSON.stringify(lineItemsMapped));

    return lineItemsMapped;
  }
  
  toggleCart(){
    this.setState({cartOpen: !this.state.cartOpen});
  }


  render() {
    return (
      <React.Fragment>
        <Router>
          <Route
            path="/products/:handle"
            exact
            render={(props) => <Product  {...props} addVariant={this.addVariant} />}
          >

          </Route>
        </Router>
    <button className="cart__open" onClick={this.toggleCart}>Cart {this.cartQuantity()}</button>
        {
          this.state.cartOpen && 
          <Cart 
            checkout={this.state.checkout} 
            clearCart={ this.clearCart }
            toggleCart={ this.toggleCart }
          /> 
        }
      </React.Fragment>

    );
  }
};


const AppWithData = compose(
  graphql(createCheckout, { name: 'createCheckout' }),
  graphql(checkoutLineItemsReplace, { name: 'checkoutLineItemsReplace' }),
)(App);

export default AppWithData;

