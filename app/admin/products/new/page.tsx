'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [form, setForm] = useState({
    title: '',
    brand: '',
    desc: '',
    price: '',
    discountPrice: '',
    badge: '',
    category: '베스트',
    stock: '100',
  })

  // 이미지 선택 시 미리보기
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  // 입력값 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 제출
  const handleSubmit = async () => {
    if (!form.title || !form.price) {
      toast.error('상품명과 가격은 필수입니다.')
      return
    }

    setLoading(true)

    try {
      // 1. 이미지 업로드
      let imageUrl = ''
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
      }

      // 2. 상품 저장
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
          stock: Number(form.stock),
          imageUrl,
        }),
      })

      if (!res.ok) throw new Error()

      toast.success('상품이 등록되었습니다!')
      router.push('/')
    } catch {
      toast.error('상품 등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold">상품 등록</h1>

        {/* 이미지 업로드 */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">상품 이미지</label>
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-4 text-center">
            {previewUrl ? (
              <img src={previewUrl} alt="미리보기" className="mb-2 h-48 w-full rounded-lg object-cover" />
            ) : (
              <div className="flex h-48 items-center justify-center text-gray-400">이미지를 선택해 주세요</div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
          </div>
        </div>

        {/* 상품명 */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">상품명 *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="상품명을 입력하세요"
          />
        </div>

        {/* 브랜드 */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">브랜드</label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="브랜드명"
          />
        </div>

        {/* 설명 */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">상품 설명</label>
          <textarea
            name="desc"
            value={form.desc}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="상품 설명을 입력하세요"
            rows={3}
          />
        </div>

        {/* 가격 */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">판매가 (원) *</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="10000"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">정가 (원)</label>
            <input
              name="discountPrice"
              type="number"
              value={form.discountPrice}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="15000"
            />
          </div>
        </div>

        {/* 카테고리 & 배지 */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">카테고리</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>베스트</option>
              <option>발견</option>
              <option>특가</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">배지</label>
            <input
              name="badge"
              value={form.badge}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="무료배송, 특가 등"
            />
          </div>
        </div>

        {/* 재고 */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium">재고 수량</label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="100"
          />
        </div>

        {/* 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-xl bg-blue-500 py-3 font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '등록 중...' : '상품 등록하기'}
        </button>
      </div>
    </div>
  )
}
