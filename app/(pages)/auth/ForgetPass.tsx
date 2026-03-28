'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail } from 'lucide-react'
import Link from 'next/link'

export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendCode = async () => {
    if (!email) {
      toast.error('이메일을 입력해주세요.')
      return
    }

    setIsLoading(true)

    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    setIsLoading(false)

    if (res.ok) {
      toast.success('확인 코드가 이메일로 전송되었습니다.')
    } else {
      toast.error('코드 전송에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendCode()
  }

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">비밀번호를 잊으셨나요? 🔑</h2>
        <p className="text-sm text-gray-500">이메일 주소를 입력하시면 확인 코드를 보내드립니다.</p>
      </div>

      {/* 폼 */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            이메일
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-gray-200 bg-gray-50 pl-9 transition-colors focus:bg-white"
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          onClick={handleSendCode}
          disabled={isLoading}
          className="w-full bg-gray-900 py-2.5 font-semibold text-white transition-colors hover:bg-gray-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              전송 중...
            </>
          ) : (
            '확인 코드 전송'
          )}
        </Button>
      </div>

      {/* 로그인으로 돌아가기 */}
      <p className="text-center text-sm text-gray-500">
        <Link href="/auth?type=login" className="font-medium text-blue-500 hover:underline">
          ← 로그인으로 돌아가기
        </Link>
      </p>
    </div>
  )
}
