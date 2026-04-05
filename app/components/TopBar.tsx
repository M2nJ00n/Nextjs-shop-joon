'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function TopBar() {
  const { data: session } = useSession()

  return (
    <div className="top-bar">
      {session ? (
        <>
          <span style={{ color: 'inherit' }}>{session.user?.name ?? session.user?.email}님</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <Link href="/auth?type=login" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>로그인</span>
          </Link>
          <Link href="/auth?type=sign-up" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>회원가입</span>
          </Link>
        </>
      )}
      <span>고객센터</span>
    </div>
  )
}
