import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })

const productSchema = new mongoose.Schema(
  {
    title: String,
    brand: String,
    desc: String,
    price: Number,
    discountPrice: Number,
    badge: String,
    rating: { type: String, default: '★★★★★' },
    reviews: { type: Number, default: 0 },
    imageUrl: String,
    stock: { type: Number, default: 100 },
    category: { type: String, default: '베스트' },
  },
  { timestamps: true }
)

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

const bestProducts = [
  {
    title: '나이키 에어맥스 270',
    brand: 'Nike',
    desc: '편안한 착화감의 에어맥스 쿠셔닝 운동화',
    price: 189000,
    discountPrice: 129000,
    badge: '베스트',
    rating: '★★★★★',
    reviews: 4821,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    stock: 50,
    category: '베스트',
  },
  {
    title: '애플 에어팟 프로 2세대',
    brand: 'Apple',
    desc: '노이즈캔슬링 무선 이어폰, 투명 모드 지원',
    price: 359000,
    discountPrice: 289000,
    badge: '인기',
    rating: '★★★★★',
    reviews: 9203,
    imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
    stock: 200,
    category: '베스트',
  },
  {
    title: '다이슨 v15 무선청소기',
    brand: 'Dyson',
    desc: '레이저 감지 기술 탑재, 강력한 흡입력',
    price: 899000,
    discountPrice: 749000,
    badge: '특가',
    rating: '★★★★☆',
    reviews: 3415,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    stock: 30,
    category: '베스트',
  },
  {
    title: '삼성 갤럭시 버즈2 프로',
    brand: 'Samsung',
    desc: '360 오디오, 스마트 노이즈캔슬링 이어버즈',
    price: 219000,
    discountPrice: 169000,
    badge: '베스트',
    rating: '★★★★★',
    reviews: 6710,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
    stock: 120,
    category: '베스트',
  },
  {
    title: '르쿠르제 무쇠냄비 22cm',
    brand: 'Le Creuset',
    desc: '법랑 코팅 주물 냄비, 오래 쓰는 프리미엄',
    price: 479000,
    discountPrice: 389000,
    badge: '인기',
    rating: '★★★★★',
    reviews: 2188,
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop',
    stock: 40,
    category: '베스트',
  },
  {
    title: '아디다스 울트라부스트 23',
    brand: 'Adidas',
    desc: '부스트 쿠셔닝 러닝화, 가볍고 탄력있는 착화감',
    price: 219000,
    discountPrice: 159000,
    badge: '베스트',
    rating: '★★★★☆',
    reviews: 5332,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=400&h=400&fit=crop',
    stock: 80,
    category: '베스트',
  },
]

const rocketProducts = [
  {
    title: '테팔 에어프라이어 4.2L',
    brand: 'Tefal',
    desc: '기름 없이 건강하게, 넉넉한 4.2L 용량',
    price: 149000,
    discountPrice: 99000,
    badge: '로켓배송',
    rating: '★★★★★',
    reviews: 7821,
    imageUrl: 'https://images.unsplash.com/photo-1648484834958-21b1e9a5e5bc?w=400&h=400&fit=crop',
    stock: 60,
    category: '로켓배송',
  },
  {
    title: '뉴트리나 고양이 사료 6kg',
    brand: 'Purina',
    desc: '연어&참치 혼합, 성묘용 균형 영양 사료',
    price: 39000,
    discountPrice: 29900,
    badge: '로켓배송',
    rating: '★★★★☆',
    reviews: 4102,
    imageUrl: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=400&h=400&fit=crop',
    stock: 300,
    category: '로켓배송',
  },
  {
    title: '오뚜기 진라면 멀티팩 40개입',
    brand: '오뚜기',
    desc: '순한맛/매운맛 선택, 대용량 알뜰 구성',
    price: 28000,
    discountPrice: 22900,
    badge: '로켓배송',
    rating: '★★★★★',
    reviews: 12450,
    imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=400&fit=crop',
    stock: 500,
    category: '로켓배송',
  },
  {
    title: '코카콜라 제로 1.5L x 12병',
    brand: 'Coca-Cola',
    desc: '칼로리 제로, 시원하고 청량한 탄산음료',
    price: 24000,
    discountPrice: 18900,
    badge: '로켓배송',
    rating: '★★★★★',
    reviews: 8930,
    imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=400&fit=crop',
    stock: 400,
    category: '로켓배송',
  },
  {
    title: '공기청정기 미에어 4 프로',
    brand: 'Xiaomi',
    desc: 'HEPA 필터, 실시간 공기질 모니터링',
    price: 199000,
    discountPrice: 149000,
    badge: '로켓배송',
    rating: '★★★★☆',
    reviews: 3671,
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop',
    stock: 70,
    category: '로켓배송',
  },
  {
    title: '크리넥스 티슈 200매 x 6팩',
    brand: 'Kleenex',
    desc: '부드러운 3겹 화장지, 대용량 묶음 구성',
    price: 15900,
    discountPrice: 11900,
    badge: '로켓배송',
    rating: '★★★★★',
    reviews: 19200,
    imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop',
    stock: 1000,
    category: '로켓배송',
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('DB 연결 완료')

  // 기존 상품 전체 삭제
  const deleted = await Product.deleteMany({})
  console.log(`기존 상품 ${deleted.deletedCount}개 삭제`)

  // 새 상품 삽입
  const inserted = await Product.insertMany([...bestProducts, ...rocketProducts])
  console.log(`새 상품 ${inserted.length}개 등록 완료`)

  await mongoose.disconnect()
  console.log('완료!')
}

seed().catch((e) => { console.error(e); process.exit(1) })
