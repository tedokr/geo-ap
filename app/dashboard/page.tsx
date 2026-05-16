'use client'
import { useState, useEffect } from 'react'

const COLORS = {
  navy: "#1B2A4A",
  blue: "#2E6BAD",
  orange: "#F5A623",
  white: "#FFFFFF",
  offWhite: "#F8FAFD",
  lightGray: "#E8EDF4",
  textMuted: "#5A6B84",
}

async function getUserPlan(email: string): Promise<string> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_plans?email=eq.${encodeURIComponent(email)}&select=plan,status`,
      {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        }
      }
    )
    const data = await res.json()
    if (data?.[0]?.status === 'active') return data[0].plan
    return 'free'
  } catch {
    return 'free'
  }
}

export default function Dashboard() {
  const [url, setUrl] = useState("")
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [history, setHistory] = useState<any[]>([])
  const [plan, setPlan] = useState<string>('free')
  const [userEmail, setUserEmail] = useState<string>('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check for success param
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') setSuccess(true)

    // Get user email from Supabase session
    const getSession = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${document.cookie.match(/sb-[^=]+=([^;]+)/)?.[1] || ''}`,
          }
        })
        const user = await res.json()
        if (user?.email) {
          setUserEmail(user.email)
          const userPlan = await getUserPlan(user.email)
          setPlan(userPlan)
        }
      } catch {}
    }
    getSession()
  }, [])

  const handleScan = async () => {
    if (!url) return
    setScanning(true)
    setResult(null)
    setError("")
    try {
      const res = await fetch(`/api/scan?domain=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (data.error) {
        setError(data.message || "Грешка при сканиране.")
      } else {
        setResult(data)
        setHistory(prev => [data, ...prev].slice(0, 5))
      }
    }
