import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dbConnect from '@/db/dbConnect'
import Product from '@/db/models/Product'

export default async function Home() {
  await dbConnect()

  const allProducts = await Product.find({}).lean()
  
  // Separate into categories for display
  const bestData = allProducts.filter((p: any) => p.category === '베스트')
  const rocketData = allProducts.filter((p: any) => p.category === '로켓배송')

  return (
    <div className="container">
      {/* 상단 바 */}
      <div className="top-bar">
        <Link href="/auth?type=login" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span>로그인</span>
        </Link>
        <Link href="/auth?type=sign-up" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span>회원가입</span>
        </Link>
        <span>고객센터</span>
      </div>

      {/* 메인 헤더 */}
      <header className="header-main">
        <div className="logo">SHOPPING</div>
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

      {/* 메인 배너 */}
      <section className="hero-banner">[메인 프로모션 배너 이미지 영역]</section>

      {/* 베스트 */}
      <div className="section-title">
        <div>
          베스트 <span>| 지금 가장 인기 있는 상품!</span>
        </div>
      </div>
      <section className="discovery-grid">
        {bestData.map((item: any) => (
          <Link key={item._id.toString()} href={`/products/${item._id.toString()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="discovery-item">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.title} width={160} height={160} style={{ objectFit: 'cover', borderRadius: '8px', width: '100%', height: '160px' }} />
              ) : (
                <div className="img-placeholder"></div>
              )}
              <h3>{item.brand}</h3>
              <p>{item.desc}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* 로켓배송 */}
      <div className="section-title">
        <div>
          로켓배송 <span>| 빠르게 받아보세요!</span>
        </div>
      </div>
      <section className="discovery-grid">
        {rocketData.map((item: any) => (
          <Link key={item._id.toString()} href={`/products/${item._id.toString()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="discovery-item">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.title} width={160} height={160} style={{ objectFit: 'cover', borderRadius: '8px', width: '100%', height: '160px' }} />
              ) : (
                <div className="img-placeholder"></div>
              )}
              <h3>{item.brand}</h3>
              <p>{item.desc}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* 푸터 */}
      <footer>
        <ul className="footer-links">
          <li>회사소개</li>
          <li>이용약관</li>
          <li>개인정보처리방침</li>
          <li>청소년보호정책</li>
          <li>입점상담</li>
        </ul>
        <p>
          상호명: (주)쇼핑몰 | 대표이사: 홍길동 | 사업자등록번호: 123-45-67890
          <br />
          통신판매업신고: 제2026-충남아산-0000호 | 주소: 충청남도 아산시 쇼핑로 123
          <br />
          고객센터: 1588-0000 (평일 09:00~18:00)
        </p>
      </footer>
    </div>
  )
}
