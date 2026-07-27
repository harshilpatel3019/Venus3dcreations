import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { imgUrl, formatINR } from "../api";

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const firstImg = (product.images && product.images[0]) || product.image;

  const onAdd = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to bag`);
  };

  return (
    <Link to={`/product/${product.slug || product.id}`} className="group vc-product-card block">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--sand)]">
        <img src={imgUrl(firstImg)} alt={product.name} className="vc-product-img w-full h-full object-cover" />
        {product.tag && (
          <span className="absolute top-4 left-4 bg-[var(--cream)] text-[var(--espresso)] text-[10px] tracking-[0.2em] uppercase px-3 py-1.5">
            {product.tag}
          </span>
        )}
        <button
          onClick={onAdd}
          className="absolute bottom-4 right-4 w-11 h-11 bg-[var(--cream)] text-[var(--espresso)] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 hover:bg-[var(--copper)] hover:text-white"
          aria-label="Add to bag"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="pt-5 pb-2">
        <h3 className="font-serif-display text-xl leading-tight text-[var(--espresso)] group-hover:text-[var(--copper)] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs tracking-[0.14em] uppercase text-[var(--espresso)]/50">
            {product.series || (product.material?.split("\u00b7")[0]?.trim()) || "Signature series"}
          </span>
          <span className="text-sm text-[var(--espresso)]">{formatINR(product.price)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
