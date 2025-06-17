'use client'

import { useAppSelector } from "@/lib/store/hooks"
import { ToggleTheme } from "../ToggleTheme"


type Props = {
  children: React.ReactNode
}

export default function GlobalLayout({ children }: Props) {
  
  return (
    <div>
      <header className="p-4 border-b">Social Media (theme: <ToggleTheme />)</header>
      <main>{children}</main>
      <footer className="p-4 border-t">Footer</footer>
    </div>
  )
}
