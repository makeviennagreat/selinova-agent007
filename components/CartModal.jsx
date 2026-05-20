import React from 'react'

export default function CartModal({ isOpen, cart = [], updateQty, onClose, onCheckout }) {
  if (!isOpen) return null

  const total = cart.reduce((s, it) => s + (it.price * it.qty), 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4">
      <div className="w-full sm:w-96 bg-neutral-900 rounded-lg p-4">
        <h2 className="font-bold text-lg">Warenkorb</h2>
        <div className="mt-2 space-y-2 max-h-64 overflow-auto">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-neutral-400">{item.qty} × {item.price.toFixed(2)}€</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateQty && updateQty(item.id, -1)} className="px-2">-</button>
                <button onClick={() => updateQty && updateQty(item.id, 1)} className="px-2">+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="font-bold">Gesamt: {total.toFixed(2)}€</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1">Schließen</button>
            <button onClick={onCheckout} className="px-3 py-1 bg-orange-600 text-white rounded">Zur Kasse</button>
          </div>
        </div>
      </div>
    </div>
  )
}
