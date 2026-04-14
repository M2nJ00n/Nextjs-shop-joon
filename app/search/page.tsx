import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import dbConnect from '@/db/dbConnect'
import Product from '@/db/models/Product'
import TopBar from '@/app/components/TopBar'
import Header from '@/app/components/Header'

interface Props {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() ?? ''

  if (!q) redirect('/')

  await dbConnect()

  const results = await Product.find({
    title: { $regex: q, $options: 'i' },
  }).lean()

  return (
    <div className="container">
      <TopBar />
      <Header />

      <div className="mx-auto my-8 max-w-4xl px-4">
        <p className="mb-6 text-sm text-gray-500">
          <span className="font-semibold text-gray-900">&quot;{q}&quot;</span> 검색 결과
          {results.length > 0 && (
            <span className="ml-2 text-gray-400">({results.length}개)</span>
          )}
        </p>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <span className="text-5xl">🔍</span>
            <p className="text-base font-medium text-gray-500">
              &quot;{q}&quot;에 해당하는 상품이 없습니다.
            </p>
            <Link
              href="/"
              className="mt-2 rounded-lg bg-gray-900 px-6 py-2 text-sm text-white no-underline"
            >
              전체 상품 보기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {results.map((item: any) => {
              const originalPrice = item.discountPrice
                ? Math.max(item.price, item.discountPrice)
                : item.price
              const salePrice = item.discountPrice
                ? Math.min(item.price, item.discountPrice)
                : null
              const discountRate = salePrice
                ? Math.round((1 - salePrice / originalPrice) * 100)
                : null

              return (
                <Link
                  key={item._id.toString()}
                  href={`/products/${item._id.toString()}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="rounded-xl border border-gray-100 bg-white p-3 transition hover:shadow-md">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={200}
                        height={200}
                        className="mb-3 h-40 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="mb-3 h-40 w-full rounded-lg bg-gray-100" />
                    )}
                    {item.brand && (
                      <p className="mb-1 text-xs text-gray-400">{item.brand}</p>
                    )}
                    <p className="mb-2 text-sm font-medium leading-snug text-gray-800 line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-sm font-bold">
                      {discountRate ? (
                        <>
                          <span className="mr-1 text-red-500">-{discountRate}%</span>
                          {salePrice!.toLocaleString()}원
                        </>
                      ) : (
                        `${originalPrice.toLocaleString()}원`
                      )}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

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
