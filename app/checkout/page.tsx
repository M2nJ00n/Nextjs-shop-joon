'use client'

import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/app/components/CartContext'
import TopBar from '@/app/components/TopBar'
import Header from '@/app/components/Header'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

// ── 쿠폰 ──────────────────────────────────────────────────────────────
const COUPONS: Record<string, { type: 'percent' | 'fixed'; value: number; label: string }> = {
  WELCOME10: { type: 'percent', value: 10, label: '신규 회원 10% 할인' },
  STUDENT20: { type: 'percent', value: 20, label: '학생 인증 20% 할인' },
  SAVE5000:  { type: 'fixed',   value: 5000, label: '5,000원 즉시 할인' },
}

type PayMethod = 'card' | 'kakao' | 'naver'

function generateOrderNumber() {
  const ts = Date.now().toString().slice(-8)
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `ORD-${ts}-${rand}`
}

// ── 카드 결제 모달 ─────────────────────────────────────────────────────
function CardModal({ onClose, onPay }: { onClose: () => void; onPay: () => void }) {
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' })
  const [errors, setErrors] = useState<Partial<typeof card>>({})
  const [loading, setLoading] = useState(false)

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1-').replace(/-$/, '')

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }

  const validate = () => {
    const e: Partial<typeof card> = {}
    if (card.number.replace(/-/g, '').length < 16) e.number = '카드 번호 16자리를 입력해주세요.'
    if (card.expiry.length < 5) e.expiry = '유효기간을 입력해주세요.'
    if (card.cvc.length < 3) e.cvc = 'CVC 3자리를 입력해주세요.'
    if (!card.name.trim()) e.name = '카드 소유자 이름을 입력해주세요.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePay = async () => {
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    onPay()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-bold">카드 정보 입력</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer text-xl">✕</button>
        </div>
        {loading ? (
          <div className="flex flex-col items-center py-10 gap-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">결제 처리 중입니다...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">카드 번호 *</label>
              <input
                type="text"
                placeholder="0000-0000-0000-0000"
                value={card.number}
                onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
              {errors.number && <p className="text-xs text-red-500 mt-1">{errors.number}</p>}
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">유효기간 *</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
                {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">CVC *</label>
                <input
                  type="text"
                  placeholder="000"
                  maxLength={3}
                  value={card.cvc}
                  onChange={e => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '') })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
                {errors.cvc && <p className="text-xs text-red-500 mt-1">{errors.cvc}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">카드 소유자 이름 *</label>
              <input
                type="text"
                placeholder="홍길동"
                value={card.name}
                onChange={e => setCard({ ...card, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <button
              onClick={handlePay}
              className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold border-none cursor-pointer mt-2"
            >
              결제하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── 카카오페이 모달 ──────────────────────────────────────────────────
function KakaoPayModal({ amount, onClose, onPay }: { amount: number; onClose: () => void; onPay: () => void }) {
  const [loading, setLoading] = useState(false)
  const handlePay = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    onPay()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-xl">
        <div className="bg-[#FEE500] px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-gray-900 text-base">카카오페이</span>
          <button onClick={onClose} className="text-gray-600 bg-transparent border-none cursor-pointer text-xl">✕</button>
        </div>
        {loading ? (
          <div className="flex flex-col items-center py-10 gap-4">
            <div className="w-10 h-10 border-4 border-[#FEE500] border-t-gray-400 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">카카오페이 결제 처리 중...</p>
          </div>
        ) : (
          <div className="px-6 py-6 flex flex-col gap-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl">💛</span>
              <p className="text-sm text-gray-500">카카오 계정으로 간편하게 결제합니다</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">결제 금액</p>
              <p className="text-xl font-bold">{amount.toLocaleString()}원</p>
            </div>
            <button
              onClick={handlePay}
              className="w-full py-3 bg-[#FEE500] text-gray-900 rounded-xl text-sm font-bold border-none cursor-pointer"
            >
              카카오페이로 결제
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── 네이버페이 모달 ──────────────────────────────────────────────────
function NaverPayModal({ amount, onClose, onPay }: { amount: number; onClose: () => void; onPay: () => void }) {
  const [loading, setLoading] = useState(false)
  const handlePay = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    onPay()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-xl">
        <div className="bg-[#03C75A] px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-white text-base">네이버페이</span>
          <button onClick={onClose} className="text-white bg-transparent border-none cursor-pointer text-xl">✕</button>
        </div>
        {loading ? (
          <div className="flex flex-col items-center py-10 gap-4">
            <div className="w-10 h-10 border-4 border-[#03C75A] border-t-gray-200 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">네이버페이 결제 처리 중...</p>
          </div>
        ) : (
          <div className="px-6 py-6 flex flex-col gap-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl">💚</span>
              <p className="text-sm text-gray-500">네이버 아이디로 간편하게 결제합니다</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">결제 금액</p>
              <p className="text-xl font-bold">{amount.toLocaleString()}원</p>
            </div>
            <button
              onClick={handlePay}
              className="w-full py-3 bg-[#03C75A] text-white rounded-xl text-sm font-bold border-none cursor-pointer"
            >
              네이버페이로 결제
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── 메인 페이지 ──────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, clear } = useCart()
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth?type=login')
    }
  }, [status, router])

  const [form, setForm] = useState({
    name: '', phone: '', zip: '', address: '', detail: '',
    memo: '없음',
  })
  const [formErrors, setFormErrors] = useState<Partial<typeof form>>({})
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<null | { label: string; discount: number }>(null)
  const [couponError, setCouponError] = useState('')
  const [payMethod, setPayMethod] = useState<PayMethod>('card')
  const [modal, setModal] = useState<null | PayMethod>(null)
  const isPaid = useRef(false)

  useEffect(() => {
    if (!isPaid.current && items.length === 0) router.replace('/cart')
  }, [items, router])

  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="flex min-h-screen items-center justify-center text-gray-400">확인 중...</div>
  }

  // 금액 계산
  const subtotal = items.reduce((s, i) => s + (i.discountPrice ?? i.price) * i.quantity, 0)
  const shipping = subtotal >= 30000 ? 0 : 3000
  const couponDiscount = appliedCoupon?.discount ?? 0
  const total = Math.max(0, subtotal + shipping - couponDiscount)

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase()
    const c = COUPONS[code]
    if (!c) { setCouponError('유효하지 않은 쿠폰 코드입니다.'); setAppliedCoupon(null); return }
    const discount = c.type === 'percent' ? Math.floor(subtotal * c.value / 100) : c.value
    setAppliedCoupon({ label: c.label, discount })
    setCouponError('')
  }

  const validateForm = () => {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = '수령인 이름을 입력해주세요.'
    if (!/^0\d{1,2}-\d{3,4}-\d{4}$/.test(form.phone.replace(/\s/g, ''))) e.phone = '올바른 연락처를 입력해주세요. (예: 010-1234-5678)'
    if (!form.zip.trim()) e.zip = '우편번호를 입력해주세요.'
    if (!form.address.trim()) e.address = '주소를 입력해주세요.'
    if (!form.detail.trim()) e.detail = '상세 주소를 입력해주세요.'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePayClick = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setModal(payMethod)
  }

  const handlePayComplete = () => {
    const orderNumber = generateOrderNumber()
    const orderData = {
      orderNumber,
      total,
      items: items.map(i => ({ title: i.title, quantity: i.quantity, price: i.discountPrice ?? i.price })),
      address: `${form.address} ${form.detail}`,
      payMethod,
    }
    sessionStorage.setItem('lastOrder', JSON.stringify(orderData))
    isPaid.current = true
    clear()
    router.push('/checkout/complete')
  }

  const f = (key: keyof typeof form, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }))
    setFormErrors(prev => ({ ...prev, [key]: undefined }))
  }

  return (
    <div className="container">
      <TopBar />
      <Header />

      <div className="mx-auto my-8 max-w-5xl px-4">
        <h1 className="text-2xl font-bold mb-6">주문/결제</h1>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── 좌측: 폼 ─────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-5">

            {/* 배송 정보 */}
            <section className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="text-base font-bold mb-4">배송 정보</h2>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">수령인 *</label>
                  <input value={form.name} onChange={e => f('name', e.target.value)} placeholder="홍길동"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                  {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">연락처 *</label>
                  <input value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="010-1234-5678"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                  {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">우편번호 *</label>
                  <div className="flex gap-2">
                    <input value={form.zip} onChange={e => f('zip', e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="12345"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                    <button
                      onClick={() => f('zip', String(Math.floor(10000 + Math.random() * 90000)))}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200 cursor-pointer hover:bg-gray-200"
                    >주소 검색</button>
                  </div>
                  {formErrors.zip && <p className="text-xs text-red-500 mt-1">{formErrors.zip}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">주소 *</label>
                  <input value={form.address} onChange={e => f('address', e.target.value)} placeholder="서울특별시 강남구 테헤란로 123"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                  {formErrors.address && <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">상세 주소 *</label>
                  <input value={form.detail} onChange={e => f('detail', e.target.value)} placeholder="101동 202호"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                  {formErrors.detail && <p className="text-xs text-red-500 mt-1">{formErrors.detail}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">배송 메모</label>
                  <select value={form.memo} onChange={e => f('memo', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white">
                    <option>없음</option>
                    <option>문 앞에 놔주세요</option>
                    <option>경비실에 맡겨주세요</option>
                    <option>직접 수령할게요</option>
                    <option>배송 전 연락 부탁드려요</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 할인 쿠폰 */}
            <section className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="text-base font-bold mb-1">할인 쿠폰</h2>
              <p className="text-xs text-gray-400 mb-4">테스트 코드: WELCOME10 · STUDENT20 · SAVE5000</p>
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError('') }}
                  placeholder="쿠폰 코드 입력"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
                <button onClick={applyCoupon}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium border-none cursor-pointer">
                  적용
                </button>
              </div>
              {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
              {appliedCoupon && (
                <div className="flex items-center justify-between mt-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-green-700 font-medium m-0">{appliedCoupon.label} — -{appliedCoupon.discount.toLocaleString()}원</p>
                  <button onClick={() => { setAppliedCoupon(null); setCouponCode('') }}
                    className="text-green-400 bg-transparent border-none cursor-pointer text-sm">✕</button>
                </div>
              )}
            </section>

            {/* 결제 수단 */}
            <section className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="text-base font-bold mb-4">결제 수단</h2>
              <div className="flex gap-3 flex-wrap">
                {([
                  { id: 'card',  label: '신용/체크카드', emoji: '💳' },
                  { id: 'kakao', label: '카카오페이',    emoji: '💛' },
                  { id: 'naver', label: '네이버페이',    emoji: '💚' },
                ] as { id: PayMethod; label: string; emoji: string }[]).map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                      payMethod === m.id
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                    style={{ background: payMethod === m.id && m.id === 'kakao' ? '#FEE500' : undefined,
                             color:      payMethod === m.id && m.id === 'kakao' ? '#111'    : undefined,
                             borderColor:payMethod === m.id && m.id === 'kakao' ? '#FEE500' : undefined }}
                  >
                    <span>{m.emoji}</span>{m.label}
                  </button>
                ))}
              </div>
              {payMethod === 'card' && (
                <p className="text-xs text-gray-400 mt-3">결제하기 버튼 클릭 시 카드 정보를 입력합니다.</p>
              )}
              {payMethod === 'kakao' && (
                <p className="text-xs text-gray-400 mt-3">카카오 계정으로 간편하게 결제합니다.</p>
              )}
              {payMethod === 'naver' && (
                <p className="text-xs text-gray-400 mt-3">네이버 아이디로 간편하게 결제합니다.</p>
              )}
            </section>
          </div>

          {/* ── 우측: 주문 요약 ───────────────────────────────────── */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-6">
              <h2 className="text-base font-bold mb-4">주문 상품</h2>
              <div className="flex flex-col gap-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.imageUrl && <Image src={item.imageUrl} alt={item.title} width={48} height={48} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 m-0 truncate">{item.title}</p>
                      <p className="text-xs text-gray-400 m-0">{item.quantity}개</p>
                    </div>
                    <p className="text-xs font-bold flex-shrink-0">
                      {((item.discountPrice ?? item.price) * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex justify-between"><span>상품 금액</span><span>{subtotal.toLocaleString()}원</span></div>
                <div className="flex justify-between"><span>배송비</span>
                  <span>{shipping === 0 ? <span className="text-blue-500">무료</span> : `${shipping.toLocaleString()}원`}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>쿠폰 할인</span>
                    <span>-{couponDiscount.toLocaleString()}원</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold">
                <span>최종 결제 금액</span>
                <span className="text-lg text-gray-900">{total.toLocaleString()}원</span>
              </div>

              <button
                onClick={handlePayClick}
                className="w-full mt-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold border-none cursor-pointer"
              >
                결제하기
              </button>
              <Link href="/cart" className="block text-center mt-3 text-xs text-gray-400 hover:text-gray-600 no-underline">
                ← 장바구니로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {modal === 'card'  && <CardModal  onClose={() => setModal(null)} onPay={handlePayComplete} />}
      {modal === 'kakao' && <KakaoPayModal amount={total} onClose={() => setModal(null)} onPay={handlePayComplete} />}
      {modal === 'naver' && <NaverPayModal amount={total} onClose={() => setModal(null)} onPay={handlePayComplete} />}

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