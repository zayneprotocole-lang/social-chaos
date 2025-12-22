'use client'

import PageHeader from '@/components/layout/PageHeader'
import { ScrollArea } from '@/components/ui/scroll-area'

const LEGAL_CONTENT = {
  mentions: {
    title: 'Mentions Légales',
    content: `Éditeur de l'application
Social Chaos est une application de divertissement éditée à titre personnel.
Contact : contact@socialchaos.app

Hébergement
L'application est hébergée par :
• Vercel Inc. - 340 S Lemon Ave #4133, Walnut, CA 91789, USA
• Firebase (Google LLC) - 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA

Propriété intellectuelle
L'ensemble des contenus présents sur l'application Social Chaos (textes, graphismes, logos, icônes, images, vidéos, sons) sont la propriété exclusive de l'éditeur ou de leurs auteurs respectifs.

Toute reproduction, représentation, modification ou distribution de tout ou partie de l'application sans autorisation préalable est strictement interdite.`,
  },
  cgu: {
    title: "Conditions Générales d'Utilisation",
    content: `Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}

1. OBJET
Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités d'accès et d'utilisation de l'application Social Chaos.

En utilisant l'application, vous acceptez sans réserve les présentes CGU.

2. DESCRIPTION DU SERVICE
Social Chaos est une application de jeu de société numérique proposant des défis sociaux à réaliser entre amis dans un cadre récréatif et bon enfant.

L'application propose :
• Des défis ("gages") à réaliser en groupe
• Un système de missions quotidiennes
• Un suivi de progression et statistiques

3. CONDITIONS D'ACCÈS
L'application est accessible à toute personne majeure (18 ans et plus).
L'utilisation par des mineurs est strictement interdite.

L'utilisateur doit :
• Être majeur et capable juridiquement
• Disposer d'un compte Google pour l'authentification
• Accepter les présentes CGU

4. UTILISATION DE L'APPLICATION
L'utilisateur s'engage à utiliser l'application :
• De manière légale et conforme aux présentes CGU
• Dans un cadre amical et bienveillant
• Avec des personnes consentantes

L'utilisateur s'engage à NE PAS utiliser l'application pour :
• Forcer quiconque à réaliser un défi
• Harceler, menacer ou intimider d'autres personnes
• Tout usage illégal, immoral ou contraire à l'ordre public
• Des activités pouvant nuire à autrui physiquement ou moralement

5. RESPONSABILITÉ DE L'UTILISATEUR
L'UTILISATEUR EST SEUL RESPONSABLE :
• De l'utilisation qu'il fait de l'application
• Des défis qu'il choisit de réaliser ou de proposer
• Des conséquences de ses actes dans le monde réel
• Du respect du consentement des personnes impliquées

L'utilisateur s'engage à vérifier que tous les participants consentent librement aux défis proposés et peuvent refuser à tout moment.

6. ALCOOL ET SUBSTANCES
Certains défis peuvent impliquer la consommation d'alcool. L'utilisateur s'engage à :
• Consommer l'alcool avec modération
• Ne pas forcer quiconque à consommer de l'alcool
• Respecter la législation en vigueur concernant l'alcool
• Ne pas conduire après avoir consommé de l'alcool

LA CONSOMMATION EXCESSIVE D'ALCOOL EST DANGEREUSE POUR LA SANTÉ. À CONSOMMER AVEC MODÉRATION.

7. DONNÉES PERSONNELLES
L'application collecte uniquement :
• Votre identifiant Google (authentification)
• Vos profils de joueurs créés localement
• L'historique de vos parties

Ces données sont stockées localement sur votre appareil et sur nos serveurs sécurisés (Firebase).
Nous ne vendons ni ne partageons vos données avec des tiers.

Conformément au RGPD, vous disposez d'un droit d'accès, de modification et de suppression de vos données. Contactez-nous pour exercer ces droits.

8. MODIFICATION DES CGU
L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications par notification dans l'application.

9. LOI APPLICABLE
Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents français.`,
  },
  disclaimer: {
    title: '⚠️ Clause de Non-Responsabilité',
    content: `AVERTISSEMENT IMPORTANT - VEUILLEZ LIRE ATTENTIVEMENT

EXONÉRATION DE RESPONSABILITÉ

Social Chaos est une application de DIVERTISSEMENT dont le contenu est purement fictif et à but récréatif. L'éditeur de l'application SE DÉGAGE DE TOUTE RESPONSABILITÉ en cas de :

• Mauvaise utilisation de l'application
• Dommages physiques, moraux ou matériels
• Harcèlement ou comportements inappropriés
• Consommation excessive d'alcool
• Tout acte illégal commis par les utilisateurs
• Blessures ou accidents de toute nature
• Conflits entre utilisateurs
• Utilisation dans un contexte non approprié

LES DÉFIS PROPOSÉS PAR L'APPLICATION :
• Sont des suggestions, non des obligations
• Doivent être réalisés uniquement si vous le souhaitez
• Peuvent être refusés à tout moment par quiconque
• Sont destinés à un public adulte et responsable
• Ne doivent JAMAIS être imposés à qui que ce soit

CONSENTEMENT ET LIMITES
Chaque participant doit pouvoir :
• Refuser n'importe quel défi sans justification
• Quitter le jeu à tout moment
• Établir ses propres limites
• Être respecté dans ses choix

L'UTILISATEUR RECONNAÎT ET ACCEPTE :
• Utiliser l'application en toute connaissance de cause
• Assumer l'entière responsabilité de ses actes
• Ne pas tenir l'éditeur responsable de ses actions
• Que l'application n'encourage aucun comportement dangereux ou illégal

En utilisant cette application, vous acceptez expressément cette clause de non-responsabilité et dégagez l'éditeur de toute responsabilité liée à votre utilisation.`,
  },
  safe: {
    title: '🛡️ Politique Safe - Jeu Responsable',
    content: `Chez Social Chaos, nous croyons qu'un bon jeu est un jeu où tout le monde se sent en sécurité et respecté.

NOS VALEURS :

✅ CONSENTEMENT
• Personne ne doit jamais être forcé à faire quoi que ce soit
• "Non" est une réponse complète et valide
• Le consentement peut être retiré à tout moment

✅ RESPECT
• Respectez les limites de chacun
• Pas de moqueries ni de jugements
• Tout le monde doit se sentir inclus

✅ BIENVEILLANCE
• Jouez dans un esprit bon enfant
• Le but est de s'amuser ENSEMBLE
• Si quelqu'un est mal à l'aise, arrêtez

✅ RESPONSABILITÉ
• Consommez l'alcool avec modération
• Ne conduisez pas après avoir bu
• Prenez soin les uns des autres

❌ CE QUI N'EST PAS ACCEPTABLE :
• Forcer quelqu'un à boire
• Forcer quelqu'un à réaliser un défi
• Humilier ou rabaisser un joueur
• Harceler ou insister après un refus
• Tout comportement non consenti

EN CAS DE PROBLÈME :
Si vous êtes témoin ou victime d'un comportement inapproprié, nous vous encourageons à :
• Quitter le jeu immédiatement
• En parler à une personne de confiance
• Contacter les autorités si nécessaire

RAPPEL : L'abus d'alcool est dangereux pour la santé. À consommer avec modération. La vente d'alcool aux mineurs est interdite.`,
  },
  privacy: {
    title: '🔒 Politique de Confidentialité',
    content: `Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}

1. DONNÉES COLLECTÉES
Social Chaos collecte les données suivantes :

Données d'authentification (via Google) :
• Adresse e-mail
• Nom d'affichage
• Photo de profil (si disponible)
• Identifiant unique Google

Données de jeu (stockées localement et sur Firebase) :
• Profils de joueurs créés
• Historique des parties
• Scores et statistiques
• Préférences de jeu

2. UTILISATION DES DONNÉES
Vos données sont utilisées pour :
• Vous authentifier de manière sécurisée
• Sauvegarder votre progression
• Améliorer l'expérience utilisateur
• Assurer le bon fonctionnement de l'application

3. STOCKAGE ET SÉCURITÉ
• Données locales : stockées sur votre appareil (localStorage)
• Données cloud : stockées sur Firebase (Google Cloud Platform)
• Toutes les communications sont chiffrées (HTTPS)
• Nous appliquons les meilleures pratiques de sécurité

4. PARTAGE DES DONNÉES
Nous ne vendons, n'échangeons ni ne partageons vos données personnelles avec des tiers, sauf :
• Avec votre consentement explicite
• Pour respecter une obligation légale
• Pour protéger nos droits ou notre sécurité

5. COOKIES ET TRACEURS
L'application n'utilise pas de cookies publicitaires.
Seuls des cookies techniques essentiels sont utilisés pour l'authentification.

6. VOS DROITS (RGPD)
Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :
• Droit d'accès à vos données
• Droit de rectification
• Droit à l'effacement ("droit à l'oubli")
• Droit à la portabilité
• Droit d'opposition

Pour exercer ces droits, contactez-nous à : contact@socialchaos.app

7. SUPPRESSION DES DONNÉES
Pour supprimer vos données :
• Données locales : effacez les données de l'application dans les paramètres de votre navigateur
• Données cloud : contactez-nous pour demander la suppression complète

8. MODIFICATIONS
Cette politique peut être modifiée à tout moment. Vous serez informé des changements significatifs.`,
  },
}

export default function LegalPage() {
  return (
    <div className="bg-background min-h-screen">
      <PageHeader title="CGU & Mentions légales" />

      <main className="container mx-auto max-w-3xl p-4">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="mb-8 space-y-4 pr-4">
            {Object.entries(LEGAL_CONTENT).map(([key, section]) => (
              <div
                key={key}
                className={`rounded-lg border p-4 shadow-[0_0_15px_rgba(168,85,247,0.1)] backdrop-blur-md ${
                  key === 'disclaimer'
                    ? 'border-rose-500/30 bg-rose-500/10'
                    : 'border-primary/20 bg-card/40'
                }`}
              >
                <h2 className="text-foreground mb-3 text-lg font-bold">
                  {section.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}

            {/* Footer */}
            <div className="pt-4 text-center text-xs text-white/30">
              <p>
                Social Chaos © {new Date().getFullYear()} - Tous droits réservés
              </p>
              <p className="mt-1">
                En utilisant cette application, vous acceptez les présentes
                conditions.
              </p>
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
