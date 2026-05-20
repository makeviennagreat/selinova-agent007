import React from 'react'

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="p-3 bg-neutral-900 rounded-lg">
      <img src={product.image} alt={product.name} className="w-full h-44 object-cover rounded-md mb-2" />
      <h3 className="font-bold text-lg">{product.name}</h3>
      <p className="text-sm text-neutral-400">{product.desc}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-black">{product.price.toFixed(2)}€</span>
        <button onClick={() => onAdd && onAdd(product)} className="px-3 py-1 bg-orange-600 rounded text-white">Hinzufügen</button>
      </div>
    </div>
  )
}
