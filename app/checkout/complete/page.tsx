'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/app/components/TopBar'
import Link from 'next/link'

interface OrderData {
  orderNumber: string
  total: number
  items: { title: string; quantity: number; price: number }[]
  address: string
  payMethod: 'card' | 'kakao' | 'naver'
}

const PAY_LABEL: Record<string, string> = {
  card: '신용/체크카드',
  kakao: '카카오페이',
  naver: '네이버페이',
}

export default function CompletePage() {
  const [order, setOrder] = useState<OrderData | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('lastOrder')
    if (raw) setOrder(JSON.parse(raw))
  }, [])

  if (!order) {
    return (
      <div className="container">
        <TopBar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-gray-400">주문 정보를 찾을 수 없습니다.</p>
          <Link href="/" className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm no-underline">홈으로</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <TopBar />

      <header className="header-main">
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo">SHOPPING</div>
        </Link>
        <div className="search-box">
          <select aria-label="카테고리 선택"><option>전체</option><option>식품</option><option>가전</option></select>
          <input type="text" placeholder="찾고 싶은 상품을 검색해보세요!" />
          <button>🔍</button>
        </div>
        <div className="user-menu"><div>마이페이지</div><div>장바구니</div></div>
      </header>

      <div className="mx-auto my-10 max-w-lg px-4">

        {/* 완료 헤더 */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">결제가 완료되었습니다</h1>
          <p className="text-sm text-gray-500 m-0">주문해 주셔서 감사합니다. 빠르게 배송해 드리겠습니다.</p>
        </div>

        {/* 주문 번호 */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 mb-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">주문 번호</span>
          <span className="text-sm font-bold text-gray-900 tracking-wider">{order.orderNumber}</span>
        </div>

        {/* 주문 상품 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
          <h2 className="text-sm font-bold text-gray-800 mb-3">주문 상품</h2>
          <div className="flex flex-col gap-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-gray-700">
                <span className="flex-1 truncate pr-4">{item.title} <span className="text-gray-400">× {item.quantity}</span></span>
                <span className="font-medium flex-shrink-0">{(item.price * item.quantity).toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-bold text-gray-800 mb-3">결제 정보</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>결제 수단</span>
              <span>{PAY_LABEL[order.payMethod]}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>배송지</span>
              <span className="text-right max-w-[60%]">{order.address}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-gray-100 pt-2 mt-1">
              <span>최종 결제 금액</span>
              <span className="text-base">{order.total.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Link href="/"
            className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold text-center no-underline">
            쇼핑 계속하기
          </Link>
          <Link href="/cart"
            className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold text-center no-underline">
            장바구니 확인
          </Link>
        </div>
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