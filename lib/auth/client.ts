'use client'

export async function getAuthUser() {
  try {
    const response = await fetch('/api/auth/me')
    if (!response.ok) {
      return null
    }
    return response.json()
  } catch (error) {
    return null
  }
}

export async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/auth/login'
  } catch (error) {
    console.error('Error logging out:', error)
  }
}

