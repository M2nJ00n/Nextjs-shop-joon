'use client'

import { useCart } from './CartContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  product: {
    id: string
    title: string
    price: number
    discountPrice?: number
    imageUrl?: string
  }
  isSoldOut: boolean
}

export default function AddToCartButton({ product, isSoldOut }: Props) {
  const { add } = useCart()
  const router = useRouter()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    add({
      id: product.id,
      title: product.title,
      price: product.price,
      discountPrice: product.discountPrice,
      imageUrl: product.imageUrl,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex gap-3 mt-3">
      <button
        onClick={handleAddToCart}
        disabled={isSoldOut}
        className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        style={{ background: added ? '#16a34a' : undefined }}
      >
        {added ? '✓ 담겼습니다' : '장바구니 담기'}
      </button>
      <button
        onClick={() => router.push('/cart')}
        disabled={isSoldOut}
        className="flex-1 py-3 bg-yellow-400 text-gray-900 rounded-xl text-sm font-semibold border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSoldOut ? '품절' : '바로 구매'}
      </button>
    </div>
  )
}