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
      <div className="mx-auto my-8 md:my-10 max-w-4xl">
        {/* 뒤로가기 */}
        <Link href="/" className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-800 no-underline">
          ← 목록으로
        </Link>

        <div className="flex flex-col md:flex-row gap-8 md:gap-10">
          {/* 이미지 */}
          <div className="w-full md:w-[360px] md:flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden min-h-[240px] md:min-h-[360px] flex items-center justify-center">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={360}
                height={360}
                className="w-full object-cover h-[240px] md:h-[360px]"
              />
            ) : (
              <span className="text-gray-400 text-sm">이미지 없음</span>
            )}
          </div>

          {/* 정보 */}
          <div className="flex-1 flex flex-col gap-4">
            {product.badge && (
              <span className="inline-block bg-gray-900 text-white text-xs px-3 py-1 rounded w-fit">
                {product.badge}
              </span>
            )}
            {product.brand && (
              <p className="text-gray-400 text-sm m-0">{product.brand}</p>
            )}
            <h1 className="text-xl md:text-2xl font-bold m-0 leading-snug">{product.title}</h1>
            {product.desc && (
              <p className="text-gray-600 text-sm md:text-base m-0">{product.desc}</p>
            )}

            {/* 가격 */}
            <div className="flex items-center gap-3">
              {product.discountPrice ? (
                <>
                  <span className="text-2xl font-bold">{product.discountPrice.toLocaleString()}원</span>
                  <span className="text-base text-gray-400 line-through">{product.price.toLocaleString()}원</span>
                </>
              ) : (
                <span className="text-2xl font-bold">{product.price.toLocaleString()}원</span>
              )}
            </div>

            {/* 평점 */}
            <p className="text-yellow-500 text-sm m-0">
              {product.rating} <span className="text-gray-400 text-xs">({product.reviews}개 리뷰)</span>
            </p>

            {/* 버튼 */}
            <div className="flex gap-3 mt-2">
              <button className="flex-1 py-3 bg-gray-900 text-white rounded-lg text-sm md:text-base font-semibold cursor-pointer border-none">
                장바구니 담기
              </button>
              <button className="flex-1 py-3 bg-yellow-400 text-white rounded-lg text-sm md:text-base font-semibold cursor-pointer border-none">
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
