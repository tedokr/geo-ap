import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { domain, businessName, businessCategory, location } = body

  if (!domain || !businessCategory || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase()

  const prompt = `You are a helpful assistant. A user is asking about businesses in a specific category and location.

Please answer this question as you normally would, listing real businesses you know about:

"What are the top 20 ${businessCategory} in ${location}? For each one, include their website URL if you know it."

Important: Answer naturally and honestly. List businesses you actually know about. Include website URLs when you know them.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'AI API error' }, { status: 500 })
    }

    const data = await response.json()
    const aiResponse = data.content?.[0]?.text || ''

    // Check if domain or business name is mentioned
    const domainMentioned = aiResponse.toLowerCase().includes(cleanDomain.toLowerCase())
    const nameMentioned = businessName 
      ? aiResponse.toLowerCase().includes(businessName.toLowerCase()) 
      : false
    const isMentioned = domainMentioned || nameMentioned

    // Extract which position it appears (rough estimate)
    let position: number | null = null
    if (isMentioned) {
      const lines = aiResponse.split('\n')
      for (let i = 0; i < lines.length; i++) {
        if (
          lines[i].toLowerCase().includes(cleanDomain.toLowerCase()) ||
          (businessName && lines[i].toLowerCase().includes(businessName.toLowerCase()))
        ) {
          // Try to extract number from line
          const numMatch = lines[i].match(/^(\d+)[.\)]/);
          if (numMatch) position = parseInt(numMatch[1])
          else position = i + 1
          break
        }
      }
    }

    return NextResponse.json({
      isMentioned,
      domainMentioned,
      nameMentioned,
      position,
      aiResponse,
      query: `Top 20 ${businessCategory} in ${location}`,
      checkedAt: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ error: 'Check failed: ' + String(error) }, { status: 500 })
  }
}
