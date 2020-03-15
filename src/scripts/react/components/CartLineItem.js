import React from "react";

const CartLineItem = (props) => {
  const { title, quantity } = props.item;
  const { image, price } = props.item.variant;
  return (
    <div className="cart__line-item">
      <img src={image.transformedSrc} />
      <div>
        <span>{title}</span> <br />
        <span>Quantity: {quantity}</span><br />
        <span>Price: { price * quantity }</span><br />
      </div>
    </div>
  )
}

export default CartLineItem;