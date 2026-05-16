import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

async function updateUserPlan(email: string, plan: string, status: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({ email, plan, status, updated_at: new Date().toISOString() })
  })
  console.log('Supabase update status:', res.status)
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  try {
    // Parse event without verification for now (add verification later)
    const event = JSON.parse(body)
    console.log('Webhook event:', event.type)

    if (event.type === 'customer.subscription.created' || 
        event.type === 'customer.subscription.updated') {
      const subscription = event.data.object
      const customerId = subscription.customer
      const status = subscription.status
      const priceId = subscription.items?.data?.[0]?.price?.id

      // Determine plan from price ID
      let plan = 'lite'
      const smartPrices = [
        process.env.STRIPE_SMART_MONTHLY,
        process.env.STRIPE_SMART_YEARLY
      ]
      const proPrices = [
        process.env.STRIPE_PRO_MONTHLY,
        process.env.STRIPE_PRO_YEARLY
      ]

      if (smartPrices.includes(priceId)) plan = 'smart'
      if (proPrices.includes(priceId)) plan = 'pro'

      // Get customer email from Stripe
      const customerRes = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
        headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` }
      })
      const customer = await customerRes.json()
      const email = customer.email

      if (email) {
        await updateUserPlan(email, plan, status)
        console.log(`Updated ${email} to ${plan} (${status})`)
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object
      const customerId = subscription.customer

      const customerRes = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
        headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` }
      })
      const customer = await customerRes.json()
      
      if (customer.email) {
        await updateUserPlan(customer.email, 'free', 'canceled')
        console.log(`Canceled subscription for ${customer.email}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
