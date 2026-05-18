import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { googleMaps, facebook, instagram, businessDesc } = await req.json()

    const hasGoogle = !!googleMaps?.trim()
    const hasFacebook = !!facebook?.trim()
    const hasInstagram = !!instagram?.trim()
    const profileCount = [hasGoogle, hasFacebook, hasInstagram].filter(Boolean).length

    const prompt = `Ти си AI видимост експерт. Анализирай онлайн присъствието на този бизнес БЕЗ уебсайт и дай скор от 0 до 25.

Бизнес описание: ${businessDesc || 'Не е предоставено'}
Google Maps: ${googleMaps || 'Няма'}
Facebook: ${facebook || 'Няма'}
Instagram: ${instagram || 'Няма'}

Правила:
- Без уебсайт максималният скор е 25
- Google Maps присъствие = +10, Facebook = +5, Instagram = +5
- Без описание = -3
- Базов скор = 5

Върни САМО валиден JSON без никакъв друг текст:
{"totalScore": <число 0-25>, "feedback": "<2-3 изречения на български защо скорът е нисък и защо уебсайтът е критично важен>"}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return NextResponse.json({
      totalScore: Math.min(25, Math.max(0, parsed.totalScore)),
      feedback: parsed.feedback,
      noWebsite: true,
      profileCount,
    })
  } catch {
    return NextResponse.json({ error: true, message: 'Грешка при анализ.' })
  }
}
