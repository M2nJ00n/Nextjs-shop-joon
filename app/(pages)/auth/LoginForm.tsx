'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, Lock } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }

    setIsLoading(true)

    const res = await signIn('credentials', {
      redirect: false,
      username: email,
      password,
    })

    setIsLoading(false)

    if (res?.ok) {
      toast.success('로그인 성공! 환영합니다 😊')
      router.push('/')
    } else {
      toast.error('이메일이나 비밀번호를 확인해주세요.')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">다시 돌아오셨군요 👋</h2>
        <p className="text-sm text-gray-500">계속하려면 로그인해주세요.</p>
      </div>

      {/* 폼 */}
      <div className="space-y-4">
        {/* 이메일 */}
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

        {/* 비밀번호 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              비밀번호
            </Label>
            <Link
              href="/auth?type=forgetpass"
              className="text-xs text-blue-500 transition-colors hover:text-blue-600 hover:underline"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-gray-200 bg-gray-50 pl-9 transition-colors focus:bg-white"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 로그인 버튼 */}
        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-gray-900 py-2.5 font-semibold text-white transition-colors hover:bg-gray-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              로그인 중...
            </>
          ) : (
            '로그인'
          )}
        </Button>
      </div>

      {/* 하단 링크 */}
      <p className="text-center text-sm text-gray-500">
        아직 계정이 없으신가요?{' '}
        <Link href="/auth?type=sign-up" className="font-medium text-blue-500 hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  )
}
