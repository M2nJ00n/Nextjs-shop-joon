import React from 'react'
import dbConnect from '@/db/dbConnect'
import Product from '@/db/models/Product'

export default async function Home() {
  await dbConnect()
  
  // Fetch products from database
  const allProducts = await Product.find({}).lean()
  
  // Separate into categories for display
  const discoveryData = allProducts.filter((p: any) => p.category === '발견')
  const specialDealsData = allProducts.filter((p: any) => p.category === '특가')

  return (
    <div className="container">
      {/* 상단 바 */}
      <div className="top-bar">
        <span>로그인</span>
        <span>회원가입</span>
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

      {/* 카테고리 네비게이션 */}
      <ul className="nav-categories">
        <li className="active">✔ 베스트</li>
        <li>특가/혜택</li>
        <li>로켓배송</li>
        <li>신선식품</li>
        <li>가전/디지털</li>
      </ul>

      {/* 메인 배너 */}
      <section className="hero-banner">[메인 프로모션 배너 이미지 영역]</section>

      {/* 오늘의 발견 */}
      <div className="section-title">
        <div>
          오늘의 발견 <span>| 오늘 쇼핑이 즐거운 가장 HOT한 상품!</span>
        </div>
      </div>
      <section className="discovery-grid">
        {discoveryData.map((item: any) => (
          <div key={item._id.toString()} className="discovery-item">
            <div className="img-placeholder"></div>
            <h3>{item.brand}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </section>

      {/* 오늘의 판매자 특가 */}
      <div className="section-title">오늘의 판매자 특가</div>
      <section className="special-deals">
        {specialDealsData.map((item: any) => (
          <div key={item._id.toString()} className="product-card">
            <div className="img-placeholder"></div>
            <div className="badge">{item.badge}</div>
            <div className="product-title">{item.title}</div>
            <div className="price-info">
              {item.price.toLocaleString()}원
              {item.discountPrice && <span className="discount">{item.discountPrice.toLocaleString()}원</span>}
            </div>
            <div className="rating">
              {item.rating} <span>({item.reviews})</span>
            </div>
          </div>
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
