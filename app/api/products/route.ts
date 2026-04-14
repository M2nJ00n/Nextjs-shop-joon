import { NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import Product from '@/db/models/Product'

export async function GET() {
  try {
    await dbConnect()
    const products = await Product.find({})
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: '상품을 불러오는데 실패했습니다.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const product = await Product.create(body)
    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('[상품 등록 오류]', error)
    return NextResponse.json({ error: error.message || '상품 등록에 실패했습니다.' }, { status: 500 })
  }
}
