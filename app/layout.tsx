import './globals.css'

export const metadata = {
  title: 'Norwegian Singles Method',
  description: 'A counterintuitive approach to distance running.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#FDFCF8] text-[#111111]">{children}</body>
    </html>
  )
}
