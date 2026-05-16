import { NextRequest, NextResponse } from 'next/server'

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY!

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { priceId, promoCode } = body

  try {
    // Създай Checkout Session
    const params: any = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://geo-ap.vercel.app/dashboard?success=true',
      cancel_url: 'https://geo-ap.vercel.app/#pricing',
      allow_promotion_codes: true,
    }

    if (promoCode) {
      params.discounts = [{ promotion_code: promoCode }]
      delete params.allow_promotion_codes
    }

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        mode: params.mode,
        'payment_method_types[0]': 'card',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        success_url: params.success_url,
        cancel_url: params.cancel_url,
        allow_promotion_codes: 'true',
      })
    })

    const session = await response.json()

    if (session.error) {
      return NextResponse.json({ error: session.error.message }, { status: 400 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
