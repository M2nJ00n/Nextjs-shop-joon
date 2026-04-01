import dbConnect from '@/db/dbConnect'
import Product from '@/db/models/Product'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProductPage({ params }: { params: { id: string } }) {
  await dbConnect()

  const product = await Product.findById(params.id).lean() as any

  if (!product) return notFound()

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

      {/* 상품 상세 */}
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 16px' }}>
        {/* 뒤로가기 */}
        <Link href="/" style={{ fontSize: '14px', color: '#666', textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
          ← 목록으로
        </Link>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          {/* 이미지 */}
          <div style={{ flex: '0 0 360px', background: '#f5f5f5', borderRadius: '12px', overflow: 'hidden', minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={360}
                height={360}
                style={{ objectFit: 'cover', width: '100%', height: '360px' }}
              />
            ) : (
              <span style={{ color: '#aaa', fontSize: '14px' }}>이미지 없음</span>
            )}
          </div>

          {/* 정보 */}
          <div style={{ flex: '1', minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {product.badge && (
              <span style={{ display: 'inline-block', background: '#111', color: '#fff', fontSize: '12px', padding: '4px 10px', borderRadius: '4px', width: 'fit-content' }}>
                {product.badge}
              </span>
            )}
            {product.brand && (
              <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>{product.brand}</p>
            )}
            <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, lineHeight: '1.4' }}>{product.title}</h1>
            {product.desc && (
              <p style={{ color: '#555', fontSize: '15px', margin: 0 }}>{product.desc}</p>
            )}

            {/* 가격 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {product.discountPrice ? (
                <>
                  <span style={{ fontSize: '24px', fontWeight: '700' }}>{product.discountPrice.toLocaleString()}원</span>
                  <span style={{ fontSize: '16px', color: '#aaa', textDecoration: 'line-through' }}>{product.price.toLocaleString()}원</span>
                </>
              ) : (
                <span style={{ fontSize: '24px', fontWeight: '700' }}>{product.price.toLocaleString()}원</span>
              )}
            </div>

            {/* 평점 */}
            <p style={{ color: '#f5a623', fontSize: '15px', margin: 0 }}>
              {product.rating} <span style={{ color: '#888', fontSize: '13px' }}>({product.reviews}개 리뷰)</span>
            </p>

            {/* 버튼 */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button style={{ flex: 1, padding: '14px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                장바구니 담기
              </button>
              <button style={{ flex: 1, padding: '14px', background: '#f5a623', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                바로 구매
              </button>
            </div>
          </div>
        </div>
      </div>

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
