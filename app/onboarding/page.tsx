'use client'
import { useState } from 'react'

const COLORS = {
  navy: "#1B2A4A",
  blue: "#2E6BAD",
  orange: "#F5A623",
  white: "#FFFFFF",
  offWhite: "#F8FAFD",
  lightGray: "#E8EDF4",
  textMuted: "#5A6B84",
}

const PLATFORMS = ['WordPress', 'Webflow', 'Wix', 'Shopify', 'Squarespace', 'Custom HTML', 'Друго']

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [info, setInfo] = useState({
    name: '',
    platform: '',
    description: '',
    location: '',
    competitors: '',
    social: '',
  })
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('faqs')
  const [error, setError] = useState('')

  const generateAll = async () => {
    setGenerating(true)
    setError('')
    const types = ['faqs', 'llms', 'robots', 'schema', 'metadesc', 'blog']
    const results: Record<string, string> = {}

    for (const type of types) {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, businessInfo: info })
        })
        const data = await res.json()
        results[type] = data.result || 'Грешка при генерация'
      } catch {
        results[type] = 'Грешка при генерация'
      }
    }
    setGenerated(results)
    setGenerating(false)
    setStep(4)
  }

  const tabs = [
    { id: 'faqs', label: '❓ FAQs' },
    { id: 'llms', label: '🤖 llms.txt' },
    { id: 'robots', label: '⚙️ robots.txt' },
    { id: 'schema', label: '📊 Schema.org' },
    { id: 'metadesc', label: '📝 Meta Description' },
    { id: 'blog', label: '✍️ Blog идеи' },
  ]

  const formatResult = (type: string, text: string) => {
    if (!text) return ''
    try {
      if (type === 'faqs') {
        const clean = text.replace(/```json|```/g, '').trim()
        const data = JSON.parse(clean)
        return data.map((f: any, i: number) => `Q${i+1}: ${f.question}\nA: ${f.answer}`).join('\n\n')
      }
      if (type === 'metadesc') {
        const clean = text.replace(/```json|```/g, '').trim()
        const data = JSON.parse(clean)
        return data.map((d: any) => `Вариант ${d.variant} (${d.length || d.text?.length} символа):\n${d.text}`).join('\n\n')
      }
      if (type === 'blog') {
        const clean = text.replace(/```json|```/g, '').trim()
        const data = JSON.parse(clean)
        const titles = data.titles?.map((t: string, i: number) => `${i+1}. ${t}`).join('\n')
        return `ЗАГЛАВИЯ:\n${titles}\n\nСТРУКТУРА НА ПЪРВИЯ ПОСТ:\n${JSON.stringify(data.outline, null, 2)}`
      }
    } catch {}
    return text.replace(/```json|```/g, '').trim()
  }

  const getInstructions = (type: string) => {
    const p = info.platform

    const instructions: Record<string, Record<string, string>> = {
      faqs: {
        WordPress: `СТЪПКА ПО СТЪПКА ЗА WORDPRESS:

1. Влез в WordPress Admin Panel
   → Отиди на yoursite.com/wp-admin
   → Въведи потребителско име и парола

2. Инсталирай плъгин за FAQs
   → Кликни на "Plugins" в лявото меню
   → Кликни "Add New Plugin"
   → В полето за търсене напиши "Rank Math SEO"
   → Кликни "Install Now" → после "Activate"

3. Отвори страницата където искаш FAQs
   → Кликни "Pages" или "Posts" в лявото меню
   → Намери страницата и кликни "Edit"

4. Добави FAQ секция
   → Кликни синия бутон "+" за нов блок
   → Напиши "FAQ" в търсачката
   → Избери "Rank Math FAQ Block"
   → Копирай въпросите и отговорите от горе

5. Публикувай
   → Кликни синия бутон "Update" или "Publish" горе вдясно
   → Schema markup се добавя автоматично от Rank Math ✓`,

        Webflow: `СТЪПКА ПО СТЪПКА ЗА WEBFLOW:

1. Влез в Webflow Designer
   → Отиди на webflow.com → Log in
   → Отвори твоя проект

2. Добави FAQ секция
   → Кликни на страницата където искаш FAQs
   → В левия панел кликни "+" (Add Element)
   → Провлачи "Section" на страницата
   → Вътре добави "Div Block" за всеки въпрос

3. Добави въпросите
   → За всеки въпрос добави "Heading" (H3) с текста на въпроса
   → Под него добави "Paragraph" с отговора
   → Копирай структурата за всеки въпрос

4. Добави Schema markup (важно за AI!)
   → Кликни на иконката за настройки на страницата (⚙️)
   → Намери "Custom Code" → "Head Code"
   → Копирай Schema.org кода от таба Schema.org
   → Постави го там и кликни "Save"

5. Публикувай
   → Кликни "Publish" горе вдясно
   → Избери домейна и кликни "Publish to Selected Domains" ✓`,

        Wix: `СТЪПКА ПО СТЪПКА ЗА WIX:

1. Влез в Wix Editor
   → Отиди на wix.com → My Sites
   → Кликни "Edit Site" на твоя сайт

2. Добави FAQ App
   → Кликни "Add Elements" (+) в левия панел
   → Кликни "App Market"
   → Търси "FAQ" и инсталирай "Wix FAQ"

3. Добави въпросите
   → Кликни на FAQ компонента
   → Кликни "Manage Questions"
   → Кликни "+ Add Question"
   → Копирай въпросите и отговорите от горе

4. Публикувай
   → Кликни "Publish" горе вдясно ✓`,

        default: `ОБЩА ИНСТРУКЦИЯ:

1. Отвори редактора на твоя сайт

2. Намери страницата където искаш да добавиш FAQs

3. Добави нова секция с въпросите и отговорите
   → Копирай въпросите от горе
   → Форматирай като въпрос (получер) + отговор

4. Добави Schema markup
   → Намери HTML секцията на страницата
   → Постави JSON-LD кода от таба Schema.org
   → Добави го преди </head> тага

5. Запази и публикувай промените ✓`
      },

      llms: {
        WordPress: `СТЪПКА ПО СТЪПКА ЗА WORDPRESS:

1. Копирай съдържанието
   → Кликни "Копирай" бутона горе вдясно
   → Отвори Notepad (Windows) или TextEdit (Mac)
   → Постави текста (Cmd+V или Ctrl+V)
   → Запази файла като "llms.txt" (важно: точно това име!)

2. Качи файла в WordPress
   → Влез в WordPress Admin → yoursite.com/wp-admin
   → Кликни "Plugins" → "Add New Plugin"
   → Търси "File Manager" → инсталирай "WP File Manager"
   → Активирай плъгина

3. Качи llms.txt
   → Кликни "WP File Manager" в лявото меню
   → Намери папката "public_html" (това е root директорията)
   → Кликни десен бутон → "Upload Files"
   → Качи llms.txt файла

4. Провери
   → Отиди на yoursite.com/llms.txt в браузъра
   → Трябва да видиш съдържанието ✓`,

        Webflow: `СТЪПКА ПО СТЪПКА ЗА WEBFLOW:

1. Копирай съдържанието
   → Кликни "Копирай" бутона горе вдясно
   → Запази като "llms.txt" файл на компютъра си

2. Качи в Webflow
   → Отиди в Webflow Dashboard (не Designer!)
   → Кликни на проекта → "Hosting"
   → Намери "301 Redirects" → всъщност трябва "Assets"
   → Кликни "Assets" в левия панел на Designer
   → Качи llms.txt файла

3. Алтернативен начин (по-лесен)
   → В Webflow Designer кликни Settings (⚙️)
   → "Custom Code" → "Head Code"
   → Добави: <link rel="llms" href="/llms.txt">

4. Провери на yoursite.com/llms.txt ✓`,

        Wix: `СТЪПКА ПО СТЪПКА ЗА WIX:

1. Wix не позволява директно качване на .txt файлове в root
   Използвай това решение:

2. Отиди в Wix Editor → Add Elements
   → Кликни "Embed Code" → "Embed HTML"
   → Добави невидим div с информацията

3. По-добро решение — Wix Velo:
   → В Editor кликни "Dev Mode" → "Turn on Dev Mode"
   → Кликни "+" до "Public" в левия панел
   → Създай файл "llms.txt" и постави съдържанието

4. Провери на yoursite.com/llms.txt ✓`,

        default: `ОБЩА ИНСТРУКЦИЯ:

1. Копирай съдържанието от горе
   → Кликни "Копирай" бутона

2. Създай файл
   → Отвори Notepad (Windows) или TextEdit (Mac)
   → Постави текста
   → Запази като "llms.txt"

3. Качи в root директорията на сайта
   → Свържи се с хостинга си чрез FTP или File Manager
   → Качи файла в главната папка (public_html или www)

4. Провери на yoursite.com/llms.txt ✓`
      },

      robots: {
        WordPress: `СТЪПКА ПО СТЪПКА ЗА WORDPRESS:

1. Влез в WordPress Admin
   → yoursite.com/wp-admin

2. Инсталирай Rank Math (ако още нямаш)
   → Plugins → Add New → търси "Rank Math SEO"
   → Install → Activate

3. Отвори robots.txt редактора
   → В лявото меню кликни "Rank Math"
   → Кликни "General Settings"
   → Намери таба "Edit robots.txt"

4. Замени съдържанието
   → Избери всичко в полето (Ctrl+A)
   → Изтрий го
   → Копирай новия robots.txt от горе
   → Постави го (Ctrl+V)
   → Кликни "Save Changes"

5. Провери на yoursite.com/robots.txt ✓`,

        Webflow: `СТЪПКА ПО СТЪПКА ЗА WEBFLOW:

1. Отиди в Project Settings
   → Webflow Dashboard → твоя проект
   → Кликни "Settings" (иконката с зъбно колело)

2. Намери SEO настройките
   → Кликни таба "SEO"
   → Превърти надолу до "robots.txt"

3. Замени съдържанието
   → Изтрий старото съдържание
   → Копирай новия robots.txt от горе
   → Постави го
   → Кликни "Save Changes"

4. Публикувай сайта
   → Designer → Publish → Publish to Selected Domains

5. Провери на yoursite.com/robots.txt ✓`,

        Wix: `СТЪПКА ПО СТЪПКА ЗА WIX:

1. Отиди в Wix Dashboard
   → wix.com → My Sites → твоя сайт

2. Намери SEO настройките
   → Кликни "Marketing & SEO" в лявото меню
   → Кликни "SEO Tools"
   → Кликни "robots.txt"

3. Замени съдържанието
   → Кликни "Edit robots.txt"
   → Изтрий старото съдържание
   → Копирай и постави новото от горе
   → Кликни "Save"

4. Провери на yoursite.com/robots.txt ✓`,

        default: `ОБЩА ИНСТРУКЦИЯ:

1. Влез в хостинг панела (cPanel, Plesk и т.н.)
   → Обикновено на yoursite.com/cpanel

2. Намери File Manager
   → Кликни "File Manager"
   → Отвори "public_html" папката

3. Намери robots.txt
   → Трябва да е в главната папка
   → Ако няма — създай нов файл с това име

4. Редактирай
   → Десен клик → Edit
   → Замени съдържанието с новото
   → Запази

5. Провери на yoursite.com/robots.txt ✓`
      },

      schema: {
        WordPress: `СТЪПКА ПО СТЪПКА ЗА WORDPRESS:

1. Влез в WordPress Admin
   → yoursite.com/wp-admin

2. Отиди в Theme Editor
   → Appearance → Theme File Editor
   → (Ако не виждаш — Appearance → Editor)

3. Намери header.php
   → В десния панел под "Theme Files"
   → Кликни на "header.php"

4. Добави Schema кода
   → Намери реда </head> (края на head секцията)
   → Постави Schema кода ПРЕДИ </head>
   → Кликни "Update File"

5. По-лесен начин — с плъгин:
   → Plugins → Add New → търси "Schema Pro"
   → Install → Activate
   → Schema Pro → Add New Schema
   → Избери типа и попълни данните ✓`,

        Webflow: `СТЪПКА ПО СТЪПКА ЗА WEBFLOW:

1. Отиди в Page Settings
   → В Designer кликни на иконката на страницата (горе вляво)
   → Кликни Settings иконката (⚙️) до страницата

2. Намери Custom Code
   → Превърти надолу до "Custom Code"
   → Намери полето "Inside <head> tag"

3. Постави Schema кода
   → Копирай Schema.org кода от горе
   → Постави го в полето
   → Кликни "Save"

4. Публикувай
   → Publish → Publish to Selected Domains

5. Провери с Google Rich Results Test
   → search.google.com/test/rich-results
   → Въведи URL-а си ✓`,

        Wix: `СТЪПКА ПО СТЪПКА ЗА WIX:

1. Отиди в Wix Editor

2. Кликни Settings горе вдясно (⚙️)

3. Намери Advanced Settings
   → Кликни "Advanced"
   → Намери "Custom Code"

4. Добави нов код
   → Кликни "+ Add Custom Code"
   → Постави Schema кода от горе
   → Избери "Head" за позиция
   → Избери "All pages" или конкретна страница
   → Кликни "Apply"

5. Публикувай сайта ✓`,

        default: `ОБЩА ИНСТРУКЦИЯ:

1. Отвори HTML файла на главната страница
   → index.html или home.html

2. Намери </head> тага
   → Използвай Ctrl+F и търси "</head>"

3. Постави кода
   → Копирай Schema.org кода от горе
   → Постави го ТОЧНО преди </head>

4. Запази файла и качи на сървъра

5. Провери с Google Rich Results Test
   → search.google.com/test/rich-results ✓`
      },

      metadesc: {
        WordPress: `СТЪПКА ПО СТЪПКА ЗА WORDPRESS:

1. Влез в WordPress Admin
   → yoursite.com/wp-admin

2. Инсталирай Rank Math (ако нямаш)
   → Plugins → Add New → "Rank Math SEO"
   → Install → Activate → Setup Wizard

3. Отвори страницата за редакция
   → Pages → намери главната страница
   → Кликни "Edit"

4. Намери Rank Math панела
   → Превърти надолу под редактора
   → Виж таба "Rank Math SEO"
   → Кликни на "Edit Snippet"

5. Попълни Meta Description
   → В полето "Description" постави избрания вариант от горе
   → Провери да е между 120-160 символа (брояч има)
   → Кликни "Update" за да запазиш ✓`,

        Webflow: `СТЪПКА ПО СТЪПКА ЗА WEBFLOW:

1. Отиди в Page Settings
   → В Designer кликни на иконката на страницата
   → Кликни Settings (⚙️)

2. Намери SEO Settings
   → Превърти до "SEO Settings"
   → Виж полето "Meta Description"

3. Постави Meta Description
   → Избери един от вариантите от горе
   → Постави го в полето
   → Провери дължината (120-160 символа е оптимално)

4. Публикувай
   → Publish → Publish to Selected Domains

5. Провери в Google Search Console след 1-2 дни ✓`,

        Wix: `СТЪПКА ПО СТЪПКА ЗА WIX:

1. Отиди в Wix Editor

2. Кликни на страницата която искаш да оптимизираш
   → Кликни иконката за настройки на страницата (⚙️)
   → Кликни "SEO Basics"

3. Попълни Meta Description
   → Намери полето "Page Description"
   → Постави избрания вариант от горе
   → Провери дължината

4. Запази и Публикувай ✓`,

        default: `ОБЩА ИНСТРУКЦИЯ:

1. Намери SEO настройките на платформата си

2. Намери полето "Meta Description"
   → Обикновено в Page Settings или SEO Settings

3. Постави избрания вариант
   → Избери Вариант 1, 2 или 3 от горе
   → Препоръчваме Вариант 1 (оптимална дължина)

4. Запази промените

5. Провери в браузъра
   → Десен клик → View Page Source
   → Търси "meta name=description" ✓`
      },

      blog: {
        WordPress: `СТЪПКА ПО СТЪПКА ЗА WORDPRESS:

1. Влез в WordPress Admin
   → yoursite.com/wp-admin

2. Създай нов пост
   → Кликни "Posts" в лявото меню
   → Кликни "+ Add New Post"

3. Добави заглавието
   → Копирай едно от заглавията от горе
   → Постави го в полето "Add title"

4. Пиши съдържанието по структурата
   → Използвай структурата от "СТРУКТУРА НА ПЪРВИЯ ПОСТ"
   → За всяка секция добави H2 заглавие (блок Heading)
   → Под него добави параграфи с текст

5. Добави изображение
   → Кликни "Set featured image" вдясно
   → Качи снимка свързана с темата

6. SEO оптимизация с Rank Math
   → Превърти надолу до Rank Math панела
   → Попълни Focus Keyword
   → Провери SEO Score (трябва да е зелено)

7. Публикувай
   → Кликни "Publish" горе вдясно ✓`,

        Webflow: `СТЪПКА ПО СТЪПКА ЗА WEBFLOW:

1. Създай Blog Collection (ако нямаш)
   → В Designer кликни "CMS" в левия панел
   → "+ New Collection" → избери "Blog Posts" template
   → Кликни "Create Collection"

2. Добави нов пост
   → CMS → Blog Posts → "+ New Blog Post"
   → Попълни заглавието от горе

3. Пиши съдържанието
   → В Rich Text полето пиши по структурата
   → Използвай H2 за секциите
   → Добави параграфи за всяка точка

4. SEO настройки
   → Превърти до SEO Settings
   → Попълни Meta Description (от Meta Description таба)
   → Добави Slug (URL-то на поста)

5. Публикувай
   → Смени статуса от "Draft" на "Published"
   → Publish сайта ✓`,

        default: `ОБЩА ИНСТРУКЦИЯ:

1. Отиди в CMS/Blog секцията на платформата си

2. Създай нов пост/статия

3. Добави заглавието
   → Копирай едно от заглавията от горе

4. Пиши по структурата
   → Въведение
   → Секция 1 с подточки
   → Секция 2 с подточки
   → Секция 3 с подточки
   → Секция 4 с подточки
   → Заключение

5. Добави Meta Description
   → Използвай вариантите от Meta Description таба

6. Публикувай ✓`
      }
    }

    const typeInstructions = instructions[type] || {}
    return typeInstructions[p] || typeInstructions['default'] || 'Следвай документацията на платформата си.'
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.offWhite, fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <header style={{ background: COLORS.navy, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.white }}>GEO<span style={{ color: COLORS.orange }}>.app</span></span>
        </a>
        <a href="/dashboard" style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, textDecoration: "none" }}>← Dashboard</a>
      </header>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 32px" }}>

        {step < 4 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              {['Бизнес информация', 'Платформа', 'Конкуренти'].map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i + 1 ? "#22c55e" : step === i + 1 ? COLORS.orange : COLORS.lightGray, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: step >= i + 1 ? COLORS.navy : COLORS.textMuted }}>
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 13, color: step === i + 1 ? COLORS.navy : COLORS.textMuted, fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ height: 4, background: COLORS.lightGray, borderRadius: 2 }}>
              <div style={{ width: `${((step - 1) / 2) * 100}%`, height: 4, background: COLORS.orange, borderRadius: 2, transition: "width 0.3s" }} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}` }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Разкажи ни за бизнеса си</h1>
            <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Тази информация ще помогне да генерираме персонализирано съдържание</p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Име на бизнеса *</label>
              <input value={info.name} onChange={e => setInfo({...info, name: e.target.value})} placeholder="Примерно: Пицария Романо" style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Опиши бизнеса си с 20 думи *</label>
              <textarea value={info.description} onChange={e => setInfo({...info, description: e.target.value})} placeholder="Примерно: Автентична италианска пицария в центъра на София с 10 години опит..." rows={3} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: "none", boxSizing: "border-box", resize: "vertical" }} />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Локация *</label>
              <input value={info.location} onChange={e => setInfo({...info, location: e.target.value})} placeholder="Примерно: София, България" style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>

            <button onClick={() => { if (info.name && info.description && info.location) setStep(2) }} style={{ width: "100%", background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Следваща стъпка →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}` }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>На каква платформа е сайтът ти?</h1>
            <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Инструкциите ще бъдат адаптирани специално за твоята платформа</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 32 }}>
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setInfo({...info, platform: p})} style={{ padding: "16px", borderRadius: 10, border: `2px solid ${info.platform === p ? COLORS.orange : COLORS.lightGray}`, background: info.platform === p ? "rgba(245,166,35,0.1)" : COLORS.white, color: COLORS.navy, fontSize: 15, fontWeight: info.platform === p ? 700 : 400, cursor: "pointer", textAlign: "left" }}>
                  {info.platform === p ? "✓ " : ""}{p}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>Социални мрежи и Google Maps (незадължително)</label>
              <textarea value={info.social} onChange={e => setInfo({...info, social: e.target.value})} placeholder="Facebook: https://facebook.com/...\nInstagram: https://instagram.com/...\nGoogle Maps: https://maps.google.com/..." rows={4} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: COLORS.lightGray, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>← Назад</button>
              <button onClick={() => { if (info.platform) setStep(3) }} style={{ flex: 2, background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Следваща стъпка →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 40, border: `1px solid ${COLORS.lightGray}` }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Кои са конкурентите ти?</h1>
            <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Ще генерираме по-добро съдържание като знаем конкурентите ти</p>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>3-5 конкурента (незадължително)</label>
              <textarea value={info.competitors} onChange={e => setInfo({...info, competitors: e.target.value})} placeholder="Примерно:\nПицария Наполи - napoli.bg\nПицария Венеция - venezia.bg\nPizza Hut Bulgaria" rows={5} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: `2px solid ${COLORS.lightGray}`, fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical" }} />
            </div>

            <div style={{ background: "rgba(245,166,35,0.1)", border: `1px solid rgba(245,166,35,0.3)`, borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
              <div style={{ fontWeight: 700, color: COLORS.navy, marginBottom: 4 }}>🚀 Готово за генерация!</div>
              <div style={{ color: COLORS.textMuted, fontSize: 14 }}>Ще генерираме: FAQs, llms.txt, robots.txt, Schema.org, Meta descriptions и Blog идеи — всичко персонализирано за {info.name} на {info.platform}</div>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "14px", marginBottom: 20, color: "#991b1b", fontSize: 14 }}>❌ {error}</div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, background: COLORS.lightGray, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>← Назад</button>
              <button onClick={generateAll} disabled={generating} style={{ flex: 2, background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.8 : 1 }}>
                {generating ? "⏳ Генерирам съдържание..." : "✨ Генерирай →"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Готово! Съдържанието е генерирано</h1>
              <p style={{ color: COLORS.textMuted, fontSize: 16 }}>Всичко е персонализирано за {info.name} на {info.platform}</p>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "10px 16px", borderRadius: 8, border: `2px solid ${activeTab === tab.id ? COLORS.orange : COLORS.lightGray}`, background: activeTab === tab.id ? "rgba(245,166,35,0.1)" : COLORS.white, color: COLORS.navy, fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 400, cursor: "pointer" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ background: COLORS.white, borderRadius: 20, padding: 32, border: `1px solid ${COLORS.lightGray}`, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, margin: 0 }}>
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <button onClick={() => navigator.clipboard.writeText(formatResult(activeTab, generated[activeTab] || ''))} style={{ background: COLORS.navy, color: COLORS.white, padding: "8px 20px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  📋 Копирай
                </button>
              </div>

              <pre style={{ background: COLORS.offWhite, borderRadius: 10, padding: 20, fontSize: 13, lineHeight: 1.6, overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", color: COLORS.navy, maxHeight: 400, border: `1px solid ${COLORS.lightGray}` }}>
                {formatResult(activeTab, generated[activeTab] || '⏳ Зареждане...')}
              </pre>
            </div>

            <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, borderRadius: 20, padding: 32, marginBottom: 24 }}>
              <h3 style={{ color: COLORS.white, fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                📋 Как да го сложиш на {info.platform} — стъпка по стъпка
              </h3>
              <pre style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, lineHeight: 1.9, whiteSpace: "pre-wrap", margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                {getInstructions(activeTab)}
              </pre>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <a href="/dashboard" style={{ flex: 1, background: COLORS.lightGray, color: COLORS.navy, padding: "16px", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 600, textAlign: "center", display: "block" }}>← Dashboard</a>
              <button onClick={() => { setStep(1); setGenerated({}); setInfo({ name: '', platform: '', description: '', location: '', competitors: '', social: '' }) }} style={{ flex: 1, background: COLORS.orange, color: COLORS.navy, padding: "16px", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>🔄 Генерирай отново</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
