'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  title: string
  price: number
  discountPrice?: number
  imageUrl?: string
  quantity: number
}

type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; quantity: number }
  | { type: 'CLEAR' }

function reducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.item.id)
      if (existing) {
        return state.map(i => i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...state, action.item]
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE_QTY':
      return state.map(i => i.id === action.id ? { ...i, quantity: action.quantity } : i)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

const CartContext = createContext<{
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
  totalCount: number
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, [], () => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  return (
    <CartContext.Provider value={{
      items,
      add: (item) => dispatch({ type: 'ADD', item }),
      remove: (id) => dispatch({ type: 'REMOVE', id }),
      updateQty: (id, quantity) => dispatch({ type: 'UPDATE_QTY', id, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
      totalCount: items.reduce((sum, i) => sum + i.quantity, 0),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}