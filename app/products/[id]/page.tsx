import dbConnect from '@/db/dbConnect'
import Product from '@/db/models/Product'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import TopBar from '@/app/components/TopBar'

// ── 상품별 장점 콘텐츠 (이미지는 DB의 detailImages 사용) ────────────
type DetailContent = {
  benefits: { emoji: string; title: string; desc: string }[]
}

const PRODUCT_DETAILS: Record<string, DetailContent> = {
  '나이키 에어맥스 270': {
    benefits: [
      { emoji: '💨', title: '270° 에어 유닛', desc: '발 전체를 감싸는 대형 에어 유닛이 걸음마다 뛰어난 쿠셔닝을 제공합니다.' },
      { emoji: '🦶', title: '인체공학적 풋베드', desc: '발 모양에 맞게 설계된 풋베드로 장시간 착용에도 피로감 없는 착화감을 선사합니다.' },
      { emoji: '🎨', title: '트렌디한 디자인', desc: '다양한 컬러웨이로 어떤 코디에도 포인트가 되는 스타일리시한 실루엣.' },
      { emoji: '🏃', title: '올라운드 퍼포먼스', desc: '일상 착용부터 가벼운 러닝까지 모든 활동에 최적화된 경량 소재 적용.' },
    ],
  },
  '애플 에어팟 프로 2세대': {
    benefits: [
      { emoji: '🔇', title: '액티브 노이즈 캔슬링', desc: '주변 소음을 최대 2배 줄여주는 H2 칩 기반 ANC로 몰입감 있는 청음 환경을 만들어 줍니다.' },
      { emoji: '👂', title: '투명 모드', desc: '이어폰을 착용한 채로도 주변 소리를 자연스럽게 들을 수 있어 안전하고 편리합니다.' },
      { emoji: '🔋', title: '최대 30시간 배터리', desc: '케이스 포함 최대 30시간 재생, 5분 충전으로 1시간 사용 가능한 고속 충전 지원.' },
      { emoji: '💧', title: 'IPX4 방수 등급', desc: '땀과 비에도 걱정 없는 방수 설계로 운동 중에도 안심하고 사용할 수 있습니다.' },
    ],
  },
  '다이슨 v15 무선청소기': {
    benefits: [
      { emoji: '🔬', title: '레이저 먼지 감지', desc: '레이저 빔이 바닥의 미세먼지를 가시화해 놓치기 쉬운 먼지까지 완벽하게 제거합니다.' },
      { emoji: '💪', title: '최강 흡입력 230AW', desc: '다이슨 역대 최강 흡입력으로 카펫·마루 모두 단 한 번의 패스로 깨끗하게 청소됩니다.' },
      { emoji: '⚡', title: '60분 연속 사용', desc: '에코 모드에서 최대 60분, 대형 공간도 배터리 걱정 없이 한 번에 청소 가능.' },
      { emoji: '🌿', title: '5단계 HEPA 필터', desc: '0.1마이크론 입자까지 포집하는 완전 밀봉 필터 시스템으로 깨끗한 공기를 되돌려 줍니다.' },
    ],
  },
  '삼성 갤럭시 버즈2 프로': {
    benefits: [
      { emoji: '🎵', title: '360 오디오', desc: '머리 추적 기술로 음악이 마치 공간에서 울려 퍼지는 듯한 몰입감 있는 사운드를 경험하세요.' },
      { emoji: '🔇', title: '스마트 ANC', desc: '주변 소음을 자동으로 감지해 노이즈 캔슬링 강도를 실시간으로 최적화합니다.' },
      { emoji: '📞', title: '선명한 통화 품질', desc: '3마이크 시스템과 보이스 픽업 유닛으로 어떤 환경에서도 명확한 통화가 가능합니다.' },
      { emoji: '💎', title: '프리미엄 피팅감', desc: '인체공학적 설계와 3가지 이어팁 크기로 오래 착용해도 불편함이 없습니다.' },
    ],
  },
  '르쿠르제 무쇠냄비 22cm': {
    benefits: [
      { emoji: '🔥', title: '균일한 열 분산', desc: '주물 소재가 열을 고르게 분산시켜 식재료를 고루 익혀 깊은 풍미를 만들어 냅니다.' },
      { emoji: '💧', title: '수분 순환 구조', desc: '뚜껑 안쪽 돌기가 증기를 물방울로 모아 다시 식재료에 뿌려주는 자체 수분 순환 시스템.' },
      { emoji: '🌍', title: '100년 보증', desc: '올바른 사용 시 평생 사용 가능한 내구성과 함께 제조사 100년 보증이 제공됩니다.' },
      { emoji: '🍳', title: '모든 열원 호환', desc: '가스·인덕션·오븐·전기레인지 등 모든 열원에서 사용 가능한 유니버설 디자인.' },
    ],
  },
  '아디다스 울트라부스트 23': {
    benefits: [
      { emoji: '🚀', title: '부스트 에너지 리턴', desc: '열가소성 폴리우레탄 캡슐이 에너지를 저장했다가 돌려주어 발걸음이 탄력 있고 가볍습니다.' },
      { emoji: '🧦', title: 'Primeknit+ 어퍼', desc: '발을 감싸는 니트 소재가 제2의 피부처럼 밀착되어 불필요한 슬립 없이 편안한 착화감을 제공.' },
      { emoji: '🌱', title: '지속 가능한 소재', desc: '해양 플라스틱 폐기물을 재활용한 Parley 소재 사용으로 환경 보호에 기여하는 제품.' },
      { emoji: '🏅', title: '런너 검증 퍼포먼스', desc: '세계 각국 마라톤 선수들이 선택한 고성능 러닝화로, 단거리부터 풀코스까지 대응.' },
    ],
  },
  '테팔 에어프라이어 4.2L': {
    benefits: [
      { emoji: '🥗', title: '기름 없는 건강 요리', desc: '뜨거운 공기를 순환시켜 기름을 최대 99% 줄이면서도 바삭하고 맛있는 결과물을 만듭니다.' },
      { emoji: '⏱️', title: '빠른 예열', desc: '별도 예열 없이 바로 시작 가능하며, 일반 오븐보다 조리 시간이 최대 30% 단축됩니다.' },
      { emoji: '🍽️', title: '4.2L 넉넉한 용량', desc: '4인 가족이 한 번에 요리할 수 있는 넉넉한 용량으로 치킨 한 마리도 통째로 조리 가능.' },
      { emoji: '🧹', title: '간편한 세척', desc: '탈착 가능한 논스틱 바스켓은 식기세척기 사용이 가능해 사용 후 관리가 매우 편리합니다.' },
    ],
  },
  '뉴트리나 고양이 사료 6kg': {
    benefits: [
      { emoji: '🐟', title: '연어·참치 더블 단백질', desc: '신선한 연어와 참치를 주원료로 고품질 동물성 단백질을 충분히 섭취할 수 있습니다.' },
      { emoji: '💊', title: '균형 잡힌 영양', desc: '성묘에 최적화된 비타민, 미네랄, 오메가3 배합으로 매일의 건강을 든든하게 지원.' },
      { emoji: '✨', title: '피모 건강 케어', desc: '오메가6 지방산이 풍부하게 함유되어 윤기 있는 털과 건강한 피부를 유지시켜 줍니다.' },
      { emoji: '🫀', title: '심장·비뇨기 건강', desc: '타우린과 칼슘 균형 조절로 고양이에게 취약한 심장과 비뇨기 건강을 적극 케어합니다.' },
    ],
  },
  '오뚜기 진라면 멀티팩 40개입': {
    benefits: [
      { emoji: '🍜', title: '진한 국물 맛', desc: '소고기와 채소를 오래 끓인 깊은 육수 베이스로 한 입에 느껴지는 진한 풍미가 일품입니다.' },
      { emoji: '🌶️', title: '순한맛·매운맛 선택', desc: '순한맛과 매운맛 두 가지 옵션으로 온 가족 취향에 맞게 선택할 수 있습니다.' },
      { emoji: '📦', title: '대용량 알뜰 구성', desc: '40개입 대용량 멀티팩으로 개당 단가를 낮춰 가성비 높은 비축용 식품으로 인기입니다.' },
      { emoji: '⚡', title: '4분 만에 완성', desc: '끓는 물에 4분이면 탱글탱글한 면발과 진한 국물이 완성되는 간편한 조리법.' },
    ],
  },
  '코카콜라 제로 1.5L x 12병': {
    benefits: [
      { emoji: '0️⃣', title: '칼로리 제로', desc: '설탕 대신 아스파탐을 사용해 칼로리는 0이지만 코카콜라 고유의 청량감은 그대로.' },
      { emoji: '🥤', title: '강렬한 탄산', desc: '코카콜라만의 비법 탄산 레시피로 시원하고 강렬한 청량감을 제공합니다.' },
      { emoji: '🏠', title: '대용량 가정용', desc: '1.5L × 12병 구성으로 가족 모두가 즐길 수 있는 든든한 가정용 묶음 패키지.' },
      { emoji: '🧊', title: '차갑게 즐기는 꿀맛', desc: '냉장 보관 후 얼음과 함께 즐기면 더욱 상쾌한 맛을 경험할 수 있습니다.' },
    ],
  },
  '공기청정기 미에어 4 프로': {
    benefits: [
      { emoji: '🌬️', title: 'True HEPA 필터', desc: '0.3마이크론 미세먼지·꽃가루·바이러스까지 99.97% 제거하는 의료급 필터 탑재.' },
      { emoji: '📊', title: '실시간 공기질 모니터링', desc: 'PM2.5 레이저 센서가 공기 상태를 실시간으로 측정해 앱과 본체 화면에 즉시 표시.' },
      { emoji: '🔇', title: '초저소음 25dB', desc: '취침 모드에서 25dB의 초저소음으로 수면을 방해하지 않고 밤새 공기를 정화합니다.' },
      { emoji: '📱', title: 'Mi Home 앱 연동', desc: '스마트폰 앱으로 어디서든 원격 제어 가능하며 AI 자동 모드로 스스로 공기질을 관리.' },
    ],
  },
  '크리넥스 티슈 200매 x 6팩': {
    benefits: [
      { emoji: '🤧', title: '3겹 소프트 시트', desc: '3겹 구조의 부드러운 시트로 민감한 피부에도 자극 없이 사용할 수 있습니다.' },
      { emoji: '💧', title: '높은 흡수력', desc: '우수한 흡수력으로 한 장으로도 충분하게 사용할 수 있어 더욱 경제적입니다.' },
      { emoji: '📦', title: '대용량 6팩 구성', desc: '200매 × 6팩 구성으로 자주 구매할 필요 없이 넉넉하게 비축할 수 있습니다.' },
      { emoji: '🌿', title: '친환경 인증 소재', desc: '지속 가능한 방식으로 조달된 원료를 사용해 환경을 생각하는 소비를 실천할 수 있습니다.' },
    ],
  },
}

function getDetail(title: string): DetailContent {
  return (
    PRODUCT_DETAILS[title] ?? {
      benefits: [
        { emoji: '✅', title: '고품질 상품', desc: '엄격한 품질 기준을 통과한 신뢰할 수 있는 상품입니다.' },
        { emoji: '🚚', title: '빠른 배송', desc: '주문 후 빠른 시간 내에 안전하게 배송해 드립니다.' },
      ],
    }
  )
}

// ── 페이지 ───────────────────────────────────────────────────────────
export default async function ProductPage({ params }: { params: { id: string } }) {
  await dbConnect()
  const product = await Product.findById(params.id).lean() as any
  if (!product) return notFound()

  const detail = getDetail(product.title)
  const isSoldOut = product.stock === 0

  const discountRate =
    product.discountPrice && product.price
      ? Math.round((1 - product.discountPrice / product.price) * 100)
      : null

  return (
    <div className="container">
      <TopBar />

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

      {/* ── 상품 카드 ─────────────────────────────────────────────── */}
      <div className="mx-auto my-8 max-w-4xl px-4">
        <Link href="/" className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-800 no-underline">
          ← 목록으로
        </Link>

        <div className="flex flex-col md:flex-row gap-8 md:gap-10">
          {/* 이미지 */}
          <div className="relative w-full md:w-[380px] md:flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden min-h-[260px] md:min-h-[380px] flex items-center justify-center">
            {isSoldOut && (
              <span className="absolute top-3 left-3 z-10 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                품절
              </span>
            )}
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={380}
                height={380}
                className="w-full object-cover h-[260px] md:h-[380px]"
              />
            ) : (
              <span className="text-gray-400 text-sm">이미지 없음</span>
            )}
          </div>

          {/* 정보 */}
          <div className="flex-1 flex flex-col gap-3">
            {/* 뱃지 */}
            <div className="flex gap-2 flex-wrap">
              {product.badge && (
                <span className="inline-block bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
              {isSoldOut && (
                <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  품절
                </span>
              )}
            </div>

            {product.brand && <p className="text-gray-400 text-sm m-0">{product.brand}</p>}

            {/* 상품명 */}
            <h1 className="text-xl md:text-2xl font-bold m-0 leading-snug">{product.title}</h1>
            {product.desc && <p className="text-gray-500 text-sm m-0">{product.desc}</p>}

            {/* 별점 */}
            <p className="text-yellow-500 text-sm m-0">
              {product.rating}{' '}
              <span className="text-gray-400 text-xs">({(product.reviews ?? 0).toLocaleString()}개 리뷰)</span>
            </p>

            {/* 가격 + 할인율 */}
            <div className="flex items-end gap-3 mt-1">
              {product.discountPrice ? (
                <>
                  {discountRate !== null && (
                    <span className="text-red-500 text-xl font-bold">{discountRate}%</span>
                  )}
                  <span className="text-2xl font-bold">{product.discountPrice.toLocaleString()}원</span>
                  <span className="text-base text-gray-400 line-through">{product.price.toLocaleString()}원</span>
                </>
              ) : (
                <span className="text-2xl font-bold">{product.price.toLocaleString()}원</span>
              )}
            </div>

            {/* 재고 */}
            {!isSoldOut && product.stock <= 10 && (
              <p className="text-orange-500 text-xs m-0">⚠️ 재고 {product.stock}개 남음</p>
            )}

            {/* 구매 버튼 */}
            <div className="flex gap-3 mt-3">
              <button
                disabled={isSoldOut}
                className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                장바구니 담기
              </button>
              <button
                disabled={isSoldOut}
                className="flex-1 py-3 bg-yellow-400 text-gray-900 rounded-xl text-sm font-semibold border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSoldOut ? '품절' : '바로 구매'}
              </button>
            </div>
          </div>
        </div>

        {/* ── 상세 정보 ───────────────────────────────────────────── */}
        <div className="mt-14 border-t border-gray-100 pt-10">

          {/* 상품 추가 이미지 (DB의 detailImages) */}
          {product.detailImages?.length > 0 && (
            <div className="mb-12">
              <h2 className="text-lg font-bold mb-5 text-gray-800">상품 상세 사진</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.detailImages.map((url: string, i: number) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-gray-100">
                    <Image
                      src={url}
                      alt={`${product.title} 상세 이미지 ${i + 1}`}
                      width={800}
                      height={500}
                      className="w-full object-cover h-[220px] md:h-[280px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 상품 혜택 */}
          <div>
            <h2 className="text-lg font-bold mb-5 text-gray-800">이 상품의 장점</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detail.benefits.map((b, i) => (
                <div key={i} className="flex gap-4 p-5 bg-gray-50 rounded-2xl">
                  <span className="text-3xl flex-shrink-0">{b.emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-900 m-0 mb-1">{b.title}</p>
                    <p className="text-sm text-gray-500 m-0 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
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
