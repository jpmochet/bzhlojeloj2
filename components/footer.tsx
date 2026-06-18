import Link from 'next/link'
import { CommissionBreakdown } from './commission-breakdown'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-ocean flex items-center justify-center">
                <span className="text-white font-bold text-sm">BZH</span>
              </div>
              <span className="font-bold text-xl">BZHlojeloj</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Chaque séjour finance le logement à l&apos;année. 
              Une plateforme solidaire pour la Bretagne.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Explorer</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/logements" className="text-muted-foreground hover:text-foreground transition-colors">
                  Logements
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Impact
                </Link>
              </li>
              <li>
                <Link href="/anticipation" className="text-muted-foreground hover:text-foreground transition-colors">
                  Anticipation N+1
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                  Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Proprietaires */}
          <div>
            <h4 className="font-semibold mb-4">Propriétaires</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/proprietaire" className="text-muted-foreground hover:text-foreground transition-colors">
                  Espace propriétaire
                </Link>
              </li>
              <li>
                <Link href="/proprietaire#services" className="text-muted-foreground hover:text-foreground transition-colors">
                  Catalogue de services
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                  Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Commission transparency */}
          <div>
            <h4 className="font-semibold mb-4">Commission transparente</h4>
            <CommissionBreakdown compact />
            <p className="text-xs text-muted-foreground mt-3">
              8% plateforme | 5% logement annuel | 3% services
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>2026 BZHlojeloj. Location solidaire en Bretagne.</p>
        </div>
      </div>
    </footer>
  )
}
