'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Building2, BarChart3, Calendar, User, Settings } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/logements', label: 'Locations saisonnières', icon: Building2 },
  { href: '/logements-a-lannee', label: "Logements à l'année", icon: Home },
  { href: '/proprietaire', label: 'Espace propriétaire', icon: User },
  { href: '/prestataire', label: 'Espace prestataire', icon: Building2 },
  { href: '/impact', label: 'Impact', icon: BarChart3 },
  { href: '/anticipation', label: 'Anticipation N+1', icon: Calendar },
  { href: '/admin', label: 'Administration', icon: Settings },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-ocean flex items-center justify-center">
            <span className="text-white font-bold text-sm">BZH</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline">BZHlojeloj</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && !item.href.includes('-a-') && pathname.startsWith(item.href + '/'))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-ocean text-ocean-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex flex-col gap-1 mt-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/' && !item.href.includes('-a-') && pathname.startsWith(item.href + '/'))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-ocean text-ocean-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
