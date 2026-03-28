'use client'

import { useState, Suspense } from 'react'
import styled from 'styled-components'
import SignUp from './Signup'
import ForgetPassword from './ForgetPass'
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

function AuthContent() {
  const searchParams = useSearchParams() // URLのクエリパラメータを取得
  const type = searchParams.get('type') // 'type' クエリパラメータを取得

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // Inside AuthContent:
  const router = useRouter()

  const handleLogin = async () => {
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    })

    if (res?.ok) {
      alert('로그인 성공!')
      router.push('/')
    } else {
      alert('로그인 실패: 이메일이나 비밀번호를 확인해주세요.')
    }
  }

  return (
    <Container>
      {type === 'login' && (
        <LoginBox>
          <Title>Welcome Back!</Title>
          <Subtitle>Please verify your identity to continue.</Subtitle>

          <InputField
            type="email"
            placeholder="Your Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <LoginButton onClick={handleLogin}>Sign In</LoginButton>

          <Links>
            <a href="/auth?type=forgetpass">Forgot password?</a>
            <p>
              Don’t have an account yet? <a href="/auth?type=sign-up">Sign up</a>
            </p>
          </Links>
        </LoginBox>
      )}

      {type === 'sign-up' && <SignUp />}

      {type === 'forgetpass' && <ForgetPassword />}
    </Container>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
`

const LoginBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 350px;
`

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f9f9f9;
`

const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #2d3748;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #1a202c;
  }
`

const Links = styled.div`
  margin-top: 1rem;

  a {
    color: #3182ce;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`
