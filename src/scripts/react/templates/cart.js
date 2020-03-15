import React from 'react'

import CartLineItem from '../components/CartLineItem';


const Cart = (props) => {
  const { checkout, clearCart, toggleCart } = props;

  return (
    <div className="cart">
      {checkout.lineItems ? (
        <div>
          {
            checkout.lineItems.edges.map((item, index) => (
              <CartLineItem item={item.node} key={`line-item-${index}`} />
            ))
          }
          <a href={checkout.webUrl}>Checkout</a>
          <button onClick={clearCart}>Clear cart</button>
          <button onClick={toggleCart}>Close</button>
          
        </div>
      ) : (
          <div>Loading...</div>
        )}
    </div>
  )
}

export default Cart;