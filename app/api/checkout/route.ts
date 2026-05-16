import { NextRequest, NextResponse } from 'next/server'

// v3
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { priceId } = body

  const secretKey = process.env.STRIPE_SECRET_KEY

  console.log('STRIPE KEY EXISTS:', !!secretKey)
  console.log('STRIPE KEY PREFIX:', secretKey?.substring(0, 15))
  console.log('PRICE ID:', priceId)

  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe key missing' }, { status: 500 })
  }

  if (!priceId) {
    return NextResponse.json({ error: 'Price ID missing' }, { status: 400 })
  }

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
    console.log('STRIPE STATUS:', response.status)
    console.log('STRIPE ERROR:', session.error?.message)

    if (!response.ok) {
      return NextResponse.json({ error: session.error?.message || 'Stripe error' }, { status: 400 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
