import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/db/dbConnect'
import Order from '@/db/models/Order'

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  await dbConnect()
  const orders = await Order.find({ userEmail: session.user.email })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const body = await req.json()
  const { orderNumber, items, subtotal, shipping, discount, total, address, payMethod } = body

  await dbConnect()
  const order = await Order.create({
    userEmail: session.user.email,
    orderNumber,
    items,
    subtotal: subtotal ?? total,
    shipping: shipping ?? 0,
    discount: discount ?? 0,
    total,
    address,
    payMethod,
  })

  return NextResponse.json({ order }, { status: 201 })
}
