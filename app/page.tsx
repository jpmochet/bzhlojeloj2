'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Home, Wrench, TrendingUp, MapPin, Calendar, Settings, Wallet, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchBar } from '@/components/search-bar'
import { CommissionBreakdown } from '@/components/commission-breakdown'
import { ImpactCounters } from '@/components/impact-counters'
import { ListingCard } from '@/components/listing-card'
import { useImpact } from '@/lib/context/impact-context'
import { listings } from '@/lib/data/listings'

const featuredListings = listings.slice(0, 4)

export default function HomePage() {
  const { stats } = useImpact()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-light via-background to-bretagne-light opacity-50" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center mb-6">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2Ff3560e1eaccc4e2cbcfd7428f9daf030%2F3bc2afd8b8f64378a5e0b299b693a5fe?format=webp&width=800&height=1200"
                alt="BZHlojeloj logo"
                width={300}
                height={300}
                className="max-w-xs md:max-w-sm"
                priority
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              <span className="text-ocean">BZHlojeloj</span> : un modèle de location de logements pour tous plus juste et solidaire.
              <div className="text-2xl md:text-3xl mt-4 text-ocean">LOJeiz koulzadel Evit al LOJeiz bloaziek</div>
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Découvrez la Bretagne Autrement en adoptant un modèle de location plus juste et solidaire.
              Notre plateforme est compétitive face aux plateformes internationales déséquilibrant le marché du logement :
              commission plus avantageuse et propriétaires pouvant transformer une part de celle-ci en services locaux.
              Elle ne remplace pas les bails classiques, mais vise à transformer une part des locations saisonnières
              (habituellement accessibles uniquement aux touristes) en logements à l&apos;année à prix régulé pour les résidents locaux.
              Elle réinvestit une partie des commissions sur les locations saisonnières
              pour financer ces logements accessibles et pour permettre aux propriétaires d&apos;accéder à une offre de services financés
              par l&apos;emploi de prestataires locaux sur la commune ou communes voisines.
              Ces services locaux ont aussi des répercussions indirectes positives sur le confort des touristes saisonniers.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Seasonal Rentals */}
            <Link href="/logements" className="group">
              <div className="rounded-2xl border-2 border-transparent bg-gradient-to-br from-ocean-light/20 to-ocean-light/5 p-8 hover:border-ocean hover:shadow-lg transition-all h-full">
                <div className="w-16 h-16 rounded-xl bg-ocean-light flex items-center justify-center mb-4 group-hover:bg-ocean group-hover:text-ocean-foreground transition-colors">
                  <MapPin className="w-8 h-8 text-ocean group-hover:text-ocean-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Locations saisonnières</h3>
                <p className="text-muted-foreground mb-4">Découvrez nos logements en courte durée partout en Bretagne</p>
                <div className="flex items-center gap-2 text-ocean font-medium group-hover:gap-3 transition-all">
                  Parcourir <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Annual Housing */}
            <Link href="/logements-a-lannee" className="group">
              <div className="rounded-2xl border-2 border-transparent bg-gradient-to-br from-bretagne-light/20 to-bretagne-light/5 p-8 hover:border-bretagne hover:shadow-lg transition-all h-full">
                <div className="w-16 h-16 rounded-xl bg-bretagne-light flex items-center justify-center mb-4 group-hover:bg-bretagne group-hover:text-bretagne-foreground transition-colors">
                  <Home className="w-8 h-8 text-bretagne group-hover:text-bretagne-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Logements à l&apos;année</h3>
                <p className="text-muted-foreground mb-4">Candidatez pour votre futur logement</p>
                <div className="flex items-center gap-2 text-bretagne font-medium group-hover:gap-3 transition-all">
                  Découvrir <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Owner Services */}
            <Link href="/proprietaire" className="group">
              <div className="rounded-2xl border-2 border-transparent bg-gradient-to-br from-coral-light/20 to-coral-light/5 p-8 hover:border-coral hover:shadow-lg transition-all h-full">
                <div className="w-16 h-16 rounded-xl bg-coral-light flex items-center justify-center mb-4 group-hover:bg-coral group-hover:text-coral-foreground transition-colors">
                  <Wrench className="w-8 h-8 text-coral group-hover:text-coral-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Espace propriétaire</h3>
                <p className="text-muted-foreground mb-4">Accédez à notre catalogue de services et gérez votre portefeuille immobilier</p>
                <div className="flex items-center gap-2 text-coral font-medium group-hover:gap-3 transition-all">
                  Accéder <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Service Provider */}
            <Link href="/prestataire" className="group">
              <div className="rounded-2xl border-2 border-transparent bg-gradient-to-br from-teal-light/20 to-teal-light/5 p-8 hover:border-teal hover:shadow-lg transition-all h-full">
                <div className="w-16 h-16 rounded-xl bg-teal-light flex items-center justify-center mb-4 group-hover:bg-teal group-hover:text-teal-foreground transition-colors">
                  <Wrench className="w-8 h-8 text-teal group-hover:text-teal-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Espace prestataire</h3>
                <p className="text-muted-foreground mb-4">Rejoignez notre réseau de prestataires et trouvez des opportunités de services</p>
                <div className="flex items-center gap-2 text-teal font-medium group-hover:gap-3 transition-all">
                  Rejoindre <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Admin */}
            <Link href="/admin" className="group">
              <div className="rounded-2xl border-2 border-transparent bg-gradient-to-br from-muted/20 to-muted/5 p-8 hover:border-foreground hover:shadow-lg transition-all h-full">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-background transition-colors">
                  <Settings className="w-8 h-8 text-foreground group-hover:text-background" />
                </div>
                <h3 className="text-xl font-bold mb-2">Administration</h3>
                <p className="text-muted-foreground mb-4">Accédez aux réglages de la plateforme et aux paramètres globaux.</p>
                <div className="flex items-center gap-2 text-foreground font-medium group-hover:gap-3 transition-all">
                  Administrer <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Commission Transparency */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Une commission 100% transparente
              </h2>
              <p className="text-muted-foreground">
                Chaque euro de commission est réparti équitablement pour financer les locations à l&apos;année accessibles et les services aux propriétaires.
              </p>
            </div>

            <Card>
              <CardContent className="p-6 md:p-8">
                <CommissionBreakdown />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-ocean-light flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-ocean" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Plateforme (5%)</h3>
                  <p className="text-sm text-muted-foreground">
                    Fonctionnement et developpement de la plateforme solidaire.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-bretagne-light flex items-center justify-center shrink-0">
                  <Home className="w-6 h-6 text-bretagne" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Logement annuel (7%)</h3>
                  <p className="text-sm text-muted-foreground">
                    Financent les locations à l&apos;année accessibles à prix régulés pour les résidents locaux, redistribués en ancrage local sur la même commune ou de façon dégressive sur les communes environnantes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-coral-light flex items-center justify-center shrink-0">
                  <Wrench className="w-6 h-6 text-coral" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Services (3%)</h3>
                  <p className="text-sm text-muted-foreground">
                    Financent les services et l&apos;emploi de prestataires locaux pour les propriétaires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Counters */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Notre impact collectif
            </h2>
            <p className="text-muted-foreground">
              Ensemble, nous construisons un modèle de location plus juste.
            </p>
          </div>
          <ImpactCounters showTotalCollected={false} />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-slate-200/70 bg-background p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Logements &agrave; l&apos;ann&eacute;e en attente</p>
              <p className="mt-3 text-3xl font-bold text-foreground">
                {stats.listingsEligibleAnnual}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-background p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Logements &agrave; l&apos;ann&eacute;e valid&eacute;s</p>
              <p className="mt-3 text-3xl font-bold text-foreground">
                {stats.listingsConvertedAnnual}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Benefits Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Les gains pour les propriétaires
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Une alternative solidaire aux plateformes internationales avec des avantages significatifs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Commission Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-ocean" />
                  Commission compétitive
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Commission moindre que les plateformes internationales
                </p>
                <p className="text-sm font-medium">
                  ✓ Commissions transformées en partie en services
                </p>
              </CardContent>
            </Card>

            {/* Annual Housing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-bretagne" />
                  Location à l&apos;année
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Revenus équivalents aux locations saisonnières en saison tendue
                </p>
                <p className="text-sm font-medium">
                  ✓ Revenus garantis en saison creuse via redistribution de points
                </p>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    ℹ️ L&apos;accès à location annuelle n&apos;est proposé que lorsque suffisamment de points de financement ont été accumulés via les locations saisonnières
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trust & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-coral" />
                  Relation de confiance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Locataire respectueux avec critères de prolongation stricts
                </p>
                <p className="text-sm font-medium">
                  ✓ Liberté de sortie accélérée en cas de non-respect (renouvellement tous les 2 mois)
                </p>
              </CardContent>
            </Card>

            {/* Financing & Renewal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-bretagne" />
                  Points de financement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Distribution garantie sur une année pour le locataire
                </p>
                <p className="text-sm font-medium">
                  ✓ Priorité de renouvellement pour locataire de confiance avec même financement
                </p>
              </CardContent>
            </Card>

            {/* Flexibility */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-ocean" />
                  Liberté et flexibilité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Pérennisation facilitée</p>
                  <p className="text-sm text-muted-foreground">
                    Liberté de pérenniser à l&apos;issue vers un bail classique avec adhésion maintenue à la plateforme
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Commission réduite continue</p>
                  <p className="text-sm text-muted-foreground">
                    Commission moindre pour continuer à bénéficier de l&apos;offre de services de prestataires locaux
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tenant Benefits - Annual Rental Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Les gains pour les locataires à l&apos;année
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Un accès au logement régulé et stable pour les résidents locaux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Affordable Rent */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-bretagne" />
                  Loyer régulé et accessible
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  500€/mois pour un T1 à prix social
                </p>
                <p className="text-sm font-medium">
                  ✓ Bien moins cher que le marché privé
                </p>
              </CardContent>
            </Card>

            {/* Stability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-ocean" />
                  Bail 1 an sans hausse de prix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Loyer fixe sur 1 an, au-delà cela dépend des redistributions de points
                </p>
                <p className="text-sm font-medium">
                  ✓ Possibilité de transformation en bail classique avec accord du propriétaire
                </p>
              </CardContent>
            </Card>

            {/* Local Community */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-coral" />
                  Vivre en Bretagne à un prix juste
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Pour les résidents locaux, finement ciblés
                </p>
                <p className="text-sm font-medium">
                  ✓ Accès prioritaire pour habitants de la commune
                </p>
              </CardContent>
            </Card>

            {/* Services Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-coral" />
                  Accès aux services de la communauté
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Réductions et priorité auprès des prestataires locaux
                </p>
                <p className="text-sm font-medium">
                  ✓ Services d&apos;entretien à coût réduit
                </p>
              </CardContent>
            </Card>

            {/* Accessible Housing */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-bretagne" />
                  Enfin des logements accessibles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Accès à des logements qui n&apos;existaient jusqu&apos;à présent que comme locations saisonnières pour touristes
                </p>
                <p className="text-sm font-medium">
                  ✓ Réservés aux résidents locaux pour transformer des espaces touristiques en vrais logements
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Seasonal Tenant Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Les gains pour les locataires saisonniers
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Découvrez l&apos;authenticité de la Bretagne à des prix justes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Fair Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-ocean" />
                  Prix justes et transparents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Pas de frais cachés, commission réduite répercutée
                </p>
                <p className="text-sm font-medium">
                  ✓ 15% de commission pour financer le logement social
                </p>
              </CardContent>
            </Card>

            {/* Quality Homes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-bretagne" />
                  Logements de qualité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Sélection rigoureuse des propriétés
                </p>
                <p className="text-sm font-medium">
                  ✓ Vérifiées et entretenues avec soin
                </p>
              </CardContent>
            </Card>

            {/* Authentic Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-coral" />
                  Expérience authentique de Bretagne
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Logements de propriétaires locaux sélectionnés
                </p>
                <p className="text-sm font-medium">
                  ✓ Une vraie immersion bretonne
                </p>
              </CardContent>
            </Card>

            {/* Social Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-ocean" />
                  Impact social direct
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Chaque réservation finance le logement social
                </p>
                <p className="text-sm font-medium">
                  ✓ Contribuez à rendre la Bretagne plus accessible
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Provider Benefits Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Les gains pour les prestataires locaux
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Développez votre activité en soutenant l&apos;économie locale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Steady Business */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-ocean" />
                  Portefeuille de clients réguliers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Accès à la communauté de propriétaires de la plateforme
                </p>
                <p className="text-sm font-medium">
                  ✓ Demandes de services garanties et régulières
                </p>
              </CardContent>
            </Card>

            {/* Fair Compensation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-bretagne" />
                  Rémunération équitable
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Points de service financés par les commissions
                </p>
                <p className="text-sm font-medium">
                  ✓ Transparence totale sur les tarifs
                </p>
              </CardContent>
            </Card>

            {/* Local Network */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-coral" />
                  Visibilité locale renforcée
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Profil et avis sur la plateforme
                </p>
                <p className="text-sm font-medium">
                  ✓ Création de réputation dans votre commune
                </p>
              </CardContent>
            </Card>

            {/* Community Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-ocean" />
                  Support de communauté
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Intégré dans un réseau solidaire et local
                </p>
                <p className="text-sm font-medium">
                  ✓ Développement économique durable
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Revenue Comparison Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Comparaison: Location saisonnière vs annuelle
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Découvrez comment les propriétaires maintiennent des revenus équivalents en passant à la location annuelle, même en basse saison
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Hypothèses de comparaison :</span> T1, prix base: 100€/nuit haute saison, 80€/nuit moyenne saison, 65€/nuit basse saison. Taux d'occupation: 85% haute saison (52 nuits), 50% moyenne saison (46 nuits), 15% basse saison (31 nuits). Loyer annuel 500€/mois, financement plateforme en moyenne 400€/mois.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Seasonal Rental */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location saisonnière (T1)</CardTitle>
                  <CardDescription>Revenus variables selon la saison</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-muted-foreground">Haute saison (juil-août, 85%)</p>
                      <p className="text-lg font-bold text-red-600">100€/nuit × 52 nuits</p>
                      <p className="text-sm font-medium">= 5 200€</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-muted-foreground">Moyenne saison (mai-jun-sep, 50%)</p>
                      <p className="text-lg font-bold text-yellow-600">80€/nuit × 46 nuits</p>
                      <p className="text-sm font-medium">= 3 680€ (pour 3 mois)</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-muted-foreground">Basse saison (oct-avr, 15%)</p>
                      <p className="text-lg font-bold text-blue-600">65€/nuit × 31 nuits</p>
                      <p className="text-sm font-medium">= 2 015€ (pour 7 mois)</p>
                      <p className="text-xs text-muted-foreground mt-1">⚠️ Revenus très faibles en basse saison</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Revenu annuel</p>
                    <p className="text-2xl font-bold">
                      <span className="text-orange-600">10 895€</span>
                      <span className="text-sm text-muted-foreground font-normal block mt-1">
                        (5200 + 3680 + 2015)
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Annual Rental */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location annuelle (T1)</CardTitle>
                  <CardDescription>Revenus régulés et garantis toute l'année</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-muted-foreground">Loyer locataire</p>
                      <p className="text-lg font-bold text-green-600">500€/mois</p>
                      <p className="text-xs text-muted-foreground">✓ Régulé et accessible</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-muted-foreground">Financement plateforme (en moyenne)</p>
                      <p className="text-lg font-bold text-green-600">400€/mois</p>
                      <p className="text-xs text-muted-foreground">✓ Redistribution des commissions saisonnières</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm text-muted-foreground">Revenu total propriétaire</p>
                      <p className="text-lg font-bold text-emerald-600">900€/mois</p>
                      <p className="text-xs text-muted-foreground">✓ Garanti même en basse saison!</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Revenu annuel garanti</p>
                    <p className="text-2xl font-bold">
                      <span className="text-emerald-600">10 800€</span>
                      <span className="text-sm text-muted-foreground font-normal block mt-1">
                        (900€ × 12 mois)
                      </span>
                    </p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground italic">
                        ℹ️ Proposée seulement quand assez de points de financement ont été accumulés par les locations saisonnières
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Stabilité</h4>
                    <p className="text-sm text-muted-foreground">
                      Revenus garantis même en basse saison: 900€/mois vs 399€/mois
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                      <Wallet className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Impact social</h4>
                    <p className="text-sm text-muted-foreground">
                      Loyer régulé (500€) accessible aux résidents locaux
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Revenus comparables</h4>
                    <p className="text-sm text-muted-foreground">
                      -95€/an (10 800€ vs 10 895€) mais garantis et plus stables toute l'année
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Logements populaires
              </h2>
              <p className="text-muted-foreground">
                Découvrez nos logements les plus appréciés en Bretagne.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/logements">
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-ocean rounded-2xl p-8 md:p-12 text-center text-ocean-foreground">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Vous êtes propriétaire en Bretagne ?
            </h2>
            <p className="text-ocean-foreground/80 mb-6 max-w-2xl mx-auto">
              Rejoignez notre réseau solidaire. Bénéficiez de services d&apos;entretien 
              financés par la communauté et participez à un modèle de location plus juste.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-background text-foreground hover:bg-background/90"
                asChild
              >
                <Link href="/proprietaire">
                  Devenir propriétaire partenaire
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-ocean-foreground/30 text-ocean-foreground hover:bg-ocean-foreground/10"
                asChild
              >
                <Link href="/impact">
                  Voir notre impact
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
