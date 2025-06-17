'use client'

type Props = {
  children: React.ReactNode
}

export default function GlobalLayout({ children }: Props) {
  const theme = 'dark' // or useAppSelector(state => state.theme.currentTheme)

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <header className="p-4 border-b">Social Media (theme: {theme})</header>
      <main>{children}</main>
      <footer className="p-4 border-t">Footer</footer>
    </div>
  )
}
