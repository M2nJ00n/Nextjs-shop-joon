'use client'

import Link from 'next/link'
import { useCart } from './CartContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { totalCount } = useCart()
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    const q = query.trim()
    if (!q) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
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
        <input
          type="text"
          placeholder="찾고 싶은 상품을 검색해보세요!"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>🔍</button>
      </div>
      <div className="user-menu">
        <Link href="/mypage" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div>마이페이지</div>
        </Link>
        <Link href="/admin/products/new" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div>상품 등록</div>
        </Link>
        <Link href="/cart" style={{ textDecoration: 'none', color: 'inherit', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            장바구니
            {totalCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-14px',
                  background: '#e53e3e',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                {totalCount > 99 ? '99+' : totalCount}
              </span>
            )}
          </div>
        </Link>
      </div>
    </header>
  )
}
