import React from "react";

const ProductGallery = (props)=>{
  const {images, selectedImg, updateSelectedImg } = props;
  return (<section className="product__gallery">
    <img 
      src={selectedImg.productImg} 
      alt={selectedImg.altText}
    />
    <ul className="product__thumbnails">
      {images.map((img, index)=>
        <li 
          key={`thumbnail-${index}`}
          onClick={()=>updateSelectedImg(img.node)}
          >
          <img src={ img.node.thumbnailImg } alt={img.node.altText} />
        </li>
        )}
    </ul>
  </section>
  )
};

export default ProductGallery;