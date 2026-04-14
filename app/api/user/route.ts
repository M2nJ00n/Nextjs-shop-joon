import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  await dbConnect()
  const user = await User.findOne({ email: session.user.email }).select('-password').lean()
  if (!user) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
  }

  return NextResponse.json({ user })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const body = await req.json()
  const { nickname, currentPassword, newPassword } = body

  await dbConnect()
  const user = await User.findOne({ email: session.user.email })
  if (!user) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
  }

  // 닉네임 변경
  if (nickname !== undefined) {
    user.nickname = nickname.trim()
  }

  // 비밀번호 변경
  if (currentPassword && newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return NextResponse.json({ error: '현재 비밀번호가 올바르지 않습니다.' }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: '새 비밀번호는 6자 이상이어야 합니다.' }, { status: 400 })
    }
    user.password = await bcrypt.hash(newPassword, 10)
  }

  user.updatedAt = new Date()
  await user.save()

  return NextResponse.json({ message: '수정되었습니다.' })
}
