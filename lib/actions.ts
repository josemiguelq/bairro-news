'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string
  const expected = process.env.ADM_PASS_B

  if (!expected || password !== expected) {
    redirect('/admin/login?error=1')
  }

  const jar = await cookies()
  jar.set('admin_auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8
  })

  redirect('/admin')
}

export async function logoutAction() {
  const jar = await cookies()
  jar.delete('admin_auth')
  redirect('/admin/login')
}
