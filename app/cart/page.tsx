'use client'

import { useCart } from '@/app/components/CartContext'
import TopBar from '@/app/components/TopBar'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, remove, updateQty } = useCart()
  const router = useRouter()

  const subtotal = items.reduce((sum, i) => sum + (i.discountPrice ?? i.price) * i.quantity, 0)
  const shipping = subtotal >= 30000 || subtotal === 0 ? 0 : 3000
  const total = subtotal + shipping

  return (
    <div className="container">
      <TopBar />

      <header className="header-main">
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo">SHOPPING</div>
        </Link>
        <div className="search-box">
          <select aria-label="카테고리 선택">
            <option>전체</option>
            <option>식품</option>
            <option>가전</option>
          </select>
          <input type="text" placeholder="찾고 싶은 상품을 검색해보세요!" />
          <button>🔍</button>
        </div>
        <div className="user-menu">
          <div>마이페이지</div>
          <div>장바구니</div>
        </div>
      </header>

      <div className="mx-auto my-8 max-w-4xl px-4">
        <h1 className="text-2xl font-bold mb-6">장바구니</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <span className="text-5xl">🛒</span>
            <p className="text-base">장바구니가 비어 있습니다.</p>
            <Link href="/" className="mt-2 px-6 py-2 bg-gray-900 text-white rounded-lg text-sm no-underline">
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* 상품 목록 */}
            <div className="flex-1 flex flex-col gap-3">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl">
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.title} width={80} height={80} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <p className="text-sm font-medium text-gray-800 m-0 leading-snug">{item.title}</p>
                    <p className="text-sm font-bold text-gray-900 m-0">
                      {(item.discountPrice ?? item.price).toLocaleString()}원
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => item.quantity > 1 && updateQty(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm cursor-pointer flex items-center justify-center"
                      >−</button>
                      <span className="text-sm w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm cursor-pointer flex items-center justify-center"
                      >+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-gray-500 text-lg bg-transparent border-none cursor-pointer">✕</button>
                    <p className="text-sm font-bold m-0">
                      {((item.discountPrice ?? item.price) * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 결제 요약 */}
            <div className="md:w-72 flex-shrink-0">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-6">
                <h2 className="text-base font-bold mb-4 text-gray-800">결제 예정 금액</h2>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>상품 금액</span>
                    <span>{subtotal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span>{shipping === 0 ? <span className="text-blue-500">무료</span> : `${shipping.toLocaleString()}원`}</span>
                  </div>
                  {shipping === 0 && subtotal > 0 && (
                    <p className="text-xs text-blue-400 m-0">30,000원 이상 무료배송</p>
                  )}
                  {shipping > 0 && (
                    <p className="text-xs text-gray-400 m-0">{(30000 - subtotal).toLocaleString()}원 더 담으면 무료배송</p>
                  )}
                </div>
                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold">
                  <span>총 결제 금액</span>
                  <span className="text-lg">{total.toLocaleString()}원</span>
                </div>
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full mt-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold border-none cursor-pointer"
                >
                  주문하기 ({items.reduce((s, i) => s + i.quantity, 0)}개)
                </button>
                <Link href="/" className="block text-center mt-3 text-sm text-gray-400 hover:text-gray-600 no-underline">
                  쇼핑 계속하기
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer>
        <ul className="footer-links">
          <li>회사소개</li><li>이용약관</li><li>개인정보처리방침</li>
          <li>청소년보호정책</li><li>입점상담</li>
        </ul>
        <p>상호명: (주)쇼핑몰 | 대표이사: 홍길동 | 사업자등록번호: 123-45-67890</p>
      </footer>
    </div>
  )
}