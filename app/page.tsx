import React from 'react'

// --- 더미 데이터 영역 ---
const discoveryData = [
  { id: 1, brand: 'PHILIPS', desc: '손목부담없는 다림질' },
  { id: 2, brand: '파워에이드', desc: '월드컵 패키지 경품' },
  { id: 3, brand: "Kellogg's", desc: '더 커진 레드베리바' },
  { id: 4, brand: '하림 펫푸드', desc: '신선한 강아지 간식' },
  { id: 5, brand: "AGE 20's", desc: '촉촉한 에센스 팩트' },
  { id: 6, brand: '건강백서', desc: '건강백서 브랜드위크' },
  { id: 7, brand: '비트', desc: '캡슐세제 특가' },
  { id: 8, brand: '힐스사이언스', desc: '다이어트 사료' },
]

const specialDealsData = [
  {
    id: 1,
    badge: '무료배송',
    title: '유기농 국내산 달콤한 햇 밤고구마 3kg, 1박스',
    price: '11,500',
    discount: '15,000',
    rating: '★★★★★',
    reviews: '1,204',
  },
  {
    id: 2,
    badge: '특가',
    title: '충남 아산 신선한 국내산 양배추 1통, 당일수확',
    price: '8,900',
    discount: '11,000',
    rating: '★★★★☆',
    reviews: '85',
  },
  {
    id: 3,
    badge: '로켓직구',
    title: '프리미엄 무선 진동 마사지건 6단계 조절',
    price: '32,000',
    discount: '45,000',
    rating: '★★★★★',
    reviews: '3,412',
  },
  {
    id: 4,
    badge: '무료배송',
    title: '캠핑용 초강력 LED 후레쉬 랜턴 충전식',
    price: '18,700',
    discount: '25,000',
    rating: '★★★★☆',
    reviews: '512',
  },
  {
    id: 5,
    badge: '무료배송',
    title: '여성용 가을 겨울 루즈핏 브이넥 니트 가디건',
    price: '27,500',
    discount: '',
    rating: '★★★★★',
    reviews: '104',
  },
]
// ----------------------

export default function Home() {
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
        {discoveryData.map((item) => (
          <div key={item.id} className="discovery-item">
            <div className="img-placeholder"></div>
            <h3>{item.brand}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </section>

      {/* 오늘의 판매자 특가 */}
      <div className="section-title">오늘의 판매자 특가</div>
      <section className="special-deals">
        {specialDealsData.map((item) => (
          <div key={item.id} className="product-card">
            <div className="img-placeholder"></div>
            <div className="badge">{item.badge}</div>
            <div className="product-title">{item.title}</div>
            <div className="price-info">
              {item.price}원{item.discount && <span className="discount">{item.discount}원</span>}
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
