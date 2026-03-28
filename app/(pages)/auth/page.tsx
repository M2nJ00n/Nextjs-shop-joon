'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import LoginForm from './LoginForm'
import SignUp from './Signup'
import ForgetPassword from './ForgetPass'
import { ShoppingBag } from 'lucide-react'

function AuthContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') ?? 'login' // 기본값: 로그인

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 shadow-md">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">Joon Shop</span>
        </div>

        {/* 카드 */}
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-sm">
          {type === 'login' && <LoginForm />}
          {type === 'sign-up' && <SignUp />}
          {type === 'forgetpass' && <ForgetPassword />}
        </div>

        {/* 하단 안내 */}
        <p className="mt-6 text-center text-xs text-gray-400">
          로그인하면{' '}
          <a href="/terms" className="underline hover:text-gray-600">
            이용약관
          </a>{' '}
          및{' '}
          <a href="/privacy" className="underline hover:text-gray-600">
            개인정보처리방침
          </a>
          에 동의하는 것으로 간주합니다.
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  )
}
