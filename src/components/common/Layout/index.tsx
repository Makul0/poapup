import { Header } from "../Header"
import { Footer } from "../Footer"

export function Layout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}