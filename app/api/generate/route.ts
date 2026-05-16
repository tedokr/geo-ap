import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { type, businessInfo } = body

  const { name, description, location, platform, competitors, social } = businessInfo

  const prompts: Record<string, string> = {
    faqs: `Ти си експерт по SEO и GEO (Generative Engine Optimization). 
Генерирай 8 често задавани въпроса (FAQs) за следния бизнес:

Бизнес: ${name}
Описание: ${description}
Локация: ${location}
Конкуренти: ${competitors}

Изисквания:
- Въпросите трябва да са реалистични и полезни за клиентите
- Отговорите трябва да са кратки (2-3 изречения)
- Включи въпроси за локацията, услугите, цените, работното време
- Форматирай като JSON масив: [{"question": "...", "answer": "..."}]
- Само JSON, без друг текст`,

    llms: `Ти си експерт по GEO (Generative Engine Optimization).
Генерирай llms.txt файл за следния бизнес:

Бизнес: ${name}
Описание: ${description}
Локация: ${location}
Социални мрежи: ${social}
Конкуренти: ${competitors}

llms.txt е файл който помага на AI системи да разберат бизнеса.
Форматирай го правилно с секции: # Business Name, ## Description, ## Services, ## Location, ## Contact, ## Social Media
Само съдържанието на файла, без обяснения.`,

    robots: `Генерирай оптимизиран robots.txt файл за уебсайт на платформа ${platform}.
Бизнес: ${name}

Изисквания:
- Позволи на всички основни AI ботове (GPTBot, ClaudeBot, PerplexityBot, GoogleBot)
- Блокирай само вредни ботове
- Добави Sitemap линк като placeholder
- Само съдържанието на файла`,

    schema: `Генерирай schema.org JSON-LD markup за следния бизнес:

Бизнес: ${name}
Описание: ${description}
Локация: ${location}
Социални мрежи: ${social}

Използвай LocalBusiness или Organization schema.
Форматирай като валиден JSON-LD script tag.
Само кода, без обяснения.`,

    metadesc: `Генерирай 3 варианта на meta description за следния бизнес:

Бизнес: ${name}
Описание: ${description}
Локация: ${location}

Изисквания:
- Всеки вариант между 120-160 символа
- Включи ключови думи за локацията
- Призив за действие
- Форматирай като JSON: [{"variant": 1, "text": "...", "length": 0}]
- Само JSON`,

    blog: `Ти си експерт по content marketing и SEO.
Генерирай структура за блог пост за следния бизнес:

Бизнес: ${name}
Описание: ${description}
Локация: ${location}

Генерирай:
1. 5 идеи за заглавия (оптимизирани за SEO)
2. За първото заглавие — пълна структура: въведение (2 изречения), 4 секции с по 2-3 точки, заключение
Форматирай като JSON: {"titles": [...], "outline": {...}}
Само JSON`,
  }

  const prompt = prompts[type]
  if (!prompt) return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

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
      const errorText = await response.text()
      console.error('Anthropic API error:', response.status, errorText)
      return NextResponse.json({ error: 'Anthropic API error: ' + response.status }, { status: 500 })
    }

    const data = await response.json()
    
    if (data.error) {
      console.error('Anthropic error:', data.error)
      return NextResponse.json({ error: data.error.message }, { status: 500 })
    }

    const text = data.content?.[0]?.text || ''
    console.log('Generated', type, '- length:', text.length)
    
    return NextResponse.json({ result: text, type })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Generation failed: ' + String(error) }, { status: 500 })
  }
}
