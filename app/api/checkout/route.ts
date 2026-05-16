import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { priceId } = body

  if (!priceId) {
    return NextResponse.json({ error: 'No price ID' }, { status: 400 })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  
  if (!secretKey) {
    console.error('STRIPE_SECRET_KEY is missing!')
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  console.log('Using key starting with:', secretKey.substring(0, 12))
  console.log('Price ID:', priceId)

  try {
    const params = new URLSearchParams()
    params.append('mode', 'subscription')
    params.append('payment_method_types[0]', 'card')
    params.append('line_items[0][price]', priceId)
    params.append('line_items[0][quantity]', '1')
    params.append('success_url', 'https://geo-ap.vercel.app/dashboard?success=true')
    params.append('cancel_url', 'https://geo-ap.vercel.app/#pricing')
    params.append('allow_promotion_codes', 'true')

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    })

    const session = await response.json()
    console.log('Stripe response status:', response.status)

    if (!response.ok) {
      console.error('Stripe error:', session.error)
      return NextResponse.json({ error: session.error?.message || 'Stripe error' }, { status: 400 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
