import { NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import Product from '@/db/models/Product'

const discoveryData = [
  { brand: 'PHILIPS', desc: '손목부담없는 다림질', category: '발견' },
  { brand: '파워에이드', desc: '월드컵 패키지 경품', category: '발견' },
  { brand: "Kellogg's", desc: '더 커진 레드베리바', category: '발견' },
  { brand: '하림 펫푸드', desc: '신선한 강아지 간식', category: '발견' },
  { brand: "AGE 20's", desc: '촉촉한 에센스 팩트', category: '발견' },
  { brand: '건강백서', desc: '건강백서 브랜드위크', category: '발견' },
  { brand: '비트', desc: '캡슐세제 특가', category: '발견' },
  { brand: '힐스사이언스', desc: '다이어트 사료', category: '발견' },
]

const specialDealsData = [
  {
    badge: '무료배송',
    title: '유기농 국내산 달콤한 햇 밤고구마 3kg, 1박스',
    price: 11500,
    discountPrice: 15000,
    rating: '★★★★★',
    reviews: 1204,
    category: '특가',
  },
  {
    badge: '특가',
    title: '충남 아산 신선한 국내산 양배추 1통, 당일수확',
    price: 8900,
    discountPrice: 11000,
    rating: '★★★★☆',
    reviews: 85,
    category: '특가',
  },
  {
    badge: '로켓직구',
    title: '프리미엄 무선 진동 마사지건 6단계 조절',
    price: 32000,
    discountPrice: 45000,
    rating: '★★★★★',
    reviews: 3412,
    category: '특가',
  },
  {
    badge: '무료배송',
    title: '캠핑용 초강력 LED 후레쉬 랜턴 충전식',
    price: 18700,
    discountPrice: 25000,
    rating: '★★★★☆',
    reviews: 512,
    category: '특가',
  },
  {
    badge: '무료배송',
    title: '여성용 가을 겨울 루즈핏 브이넥 니트 가디건',
    price: 27500,
    rating: '★★★★★',
    reviews: 104,
    category: '특가',
  },
]

export async function GET() {
  try {
    await dbConnect()

    // Clear existing products to prevent duplicates on multiple runs
    await Product.deleteMany({})

    // Insert discovery data (assigning default title/price because schema requires price and title)
    const discoveryProducts = discoveryData.map((item) => ({
      title: `${item.brand} - ${item.desc}`,
      brand: item.brand,
      desc: item.desc,
      price: 10000, // placeholder
      category: item.category,
    }))

    // Insert special deals
    const specialProducts = specialDealsData.map((item) => ({
      title: item.title,
      price: item.price,
      discountPrice: item.discountPrice,
      rating: item.rating,
      reviews: item.reviews,
      badge: item.badge,
      category: item.category,
    }))

    await Product.insertMany([...discoveryProducts, ...specialProducts])

    return NextResponse.json({ message: 'Seeding completed successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error seeding database', error }, { status: 500 })
  }
}
