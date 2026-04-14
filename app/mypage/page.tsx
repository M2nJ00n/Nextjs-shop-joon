'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TopBar from '@/app/components/TopBar'
import Header from '@/app/components/Header'

// ── 타입 ──────────────────────────────────────────────────────────────
interface OrderItem {
  title: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  orderNumber: string
  items: OrderItem[]
  total: number
  subtotal: number
  shipping: number
  discount: number
  address: string
  payMethod: string
  status: string
  createdAt: string
}

const PAY_LABEL: Record<string, string> = {
  card: '신용/체크카드',
  kakao: '카카오페이',
  naver: '네이버페이',
}

// ── 회원정보 탭 ────────────────────────────────────────────────────────
function ProfileTab({ email }: { email: string }) {
  const [nickname, setNickname] = useState('')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user')
      .then(r => r.json())
      .then(d => {
        if (d.user) setNickname(d.user.nickname || '')
      })
      .finally(() => setInitialLoading(false))
  }, [])

  const handleSave = async () => {
    if (newPw && newPw !== confirmPw) {
      setMsg({ type: 'err', text: '새 비밀번호가 일치하지 않습니다.' })
      return
    }
    setLoading(true)
    setMsg(null)
    const body: Record<string, string> = { nickname }
    if (currentPw && newPw) {
      body.currentPassword = currentPw
      body.newPassword = newPw
    }
    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setMsg({ type: 'ok', text: '저장되었습니다.' })
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
    } else {
      setMsg({ type: 'err', text: data.error || '저장에 실패했습니다.' })
    }
  }

  if (initialLoading) {
    return <div className="flex justify-center py-16 text-gray-400 text-sm">불러오는 중...</div>
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">
      {/* 기본 정보 */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="text-base font-bold mb-4 text-gray-800">기본 정보</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">이메일</label>
            <input
              value={email}
              readOnly
              className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">닉네임</label>
            <input
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
        </div>
      </section>

      {/* 비밀번호 변경 */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="text-base font-bold mb-4 text-gray-800">비밀번호 변경</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">현재 비밀번호</label>
            <input
              type="password"
              value={currentPw}
              onChange={e => setCurrentPw(e.target.value)}
              placeholder="현재 비밀번호"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">새 비밀번호</label>
            <input
              type="password"
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              placeholder="새 비밀번호 (6자 이상)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">새 비밀번호 확인</label>
            <input
              type="password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder="새 비밀번호 재입력"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
        </div>
      </section>

      {msg && (
        <p className={`text-sm text-center ${msg.type === 'ok' ? 'text-green-600' : 'text-red-500'}`}>
          {msg.text}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold border-none cursor-pointer disabled:opacity-50"
      >
        {loading ? '저장 중...' : '저장하기'}
      </button>
    </div>
  )
}

// ── 구매내역 탭 ────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => setOrders(d.orders || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex justify-center py-16 text-gray-400 text-sm">불러오는 중...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
        <span className="text-5xl">📦</span>
        <p className="text-base">구매 내역이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 max-w-2xl mx-auto">
      {orders.map(order => (
        <div key={order._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {/* 주문 헤더 */}
          <button
            onClick={() => setExpanded(expanded === order._id ? null : order._id)}
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-transparent border-none cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white bg-gray-800 px-2 py-0.5 rounded-full">
                  {order.status}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-800 m-0">
                {order.items[0]?.title}{order.items.length > 1 ? ` 외 ${order.items.length - 1}건` : ''}
              </p>
              <p className="text-xs text-gray-400 m-0 font-mono">{order.orderNumber}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
              <span className="text-base font-bold text-gray-900">{order.total.toLocaleString()}원</span>
              <span className="text-xs text-gray-400">{expanded === order._id ? '▲' : '▼'}</span>
            </div>
          </button>

          {/* 주문 상세 (펼침) */}
          {expanded === order._id && (
            <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-700">
                    <span className="flex-1 truncate pr-4">
                      {item.title} <span className="text-gray-400">× {item.quantity}</span>
                    </span>
                    <span className="font-medium flex-shrink-0">
                      {(item.price * item.quantity).toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-50 pt-3 flex flex-col gap-1.5 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>상품 금액</span>
                  <span>{(order.subtotal ?? order.total).toLocaleString()}원</span>
                </div>
                {order.shipping > 0 && (
                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span>{order.shipping.toLocaleString()}원</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>쿠폰 할인</span>
                    <span>-{order.discount.toLocaleString()}원</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-gray-800 pt-1 border-t border-gray-100 mt-1">
                  <span>최종 결제</span>
                  <span>{order.total.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>결제 수단</span>
                  <span>{PAY_LABEL[order.payMethod] ?? order.payMethod}</span>
                </div>
                {order.address && (
                  <div className="flex justify-between">
                    <span>배송지</span>
                    <span className="text-right max-w-[60%]">{order.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── 마이페이지 ─────────────────────────────────────────────────────────
export default function MyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<'profile' | 'orders'>('profile')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth?type=login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="container">
        <TopBar />
        <Header />
        <div className="flex justify-center py-32 text-gray-400 text-sm">로딩 중...</div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="container">
      <TopBar />
      <Header />

      <div className="mx-auto my-8 max-w-2xl px-4">
        {/* 페이지 제목 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
          <p className="text-sm text-gray-400 mt-1">{session.user?.email}</p>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-gray-200 mb-6">
          {([
            { key: 'profile', label: '회원정보 관리' },
            { key: 'orders',  label: '구매 내역' },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-medium border-none bg-transparent cursor-pointer transition-colors ${
                tab === t.key
                  ? 'border-b-2 border-gray-900 text-gray-900 -mb-px'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        {tab === 'profile' && <ProfileTab email={session.user?.email ?? ''} />}
        {tab === 'orders'  && <OrdersTab />}
      </div>

      <footer>
        <ul className="footer-links">
          <li>회사소개</li><li>이용약관</li><li>개인정보처리방침</li>
          <li>청소년보호정책</li><li>입점상담</li>
        </ul>
        <p>상호명: (주)쇼핑몰 | 대표이사: 홍길동 | 사업자등록번호: 123-45-67890</p>
      </footer>
    </div>
  )
}
