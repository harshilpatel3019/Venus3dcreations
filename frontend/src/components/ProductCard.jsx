import React from "react";
import { Link } from "react-router-dom";
import { imgUrl, formatINR } from "../api";

const ProductCard = ({ product }) => {
  const firstImg = (product.images && product.images[0]) || product.image;

  return (
    <Link to={`/product/${product.slug || product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--sand)]">
        <img
          src={imgUrl(firstImg)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
      </div>
      <div className="pt-6 pb-2">
        <h3 className="font-serif-display font-light text-xl leading-tight text-[var(--espresso)] transition-colors group-hover:text-[var(--copper)]">
          {product.name}
        </h3>
        <p className="text-sm text-[var(--espresso)]/70 mt-1.5">{formatINR(product.price)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
