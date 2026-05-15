export const metadata = {
  title: 'GEO App',
  description: 'Generative Engine Optimization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
