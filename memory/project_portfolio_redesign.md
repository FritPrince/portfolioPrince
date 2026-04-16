---
name: Portfolio Redesign — Cinematic Noir
description: Refonte complète du portfolio de Prince Aïneel ONILOU avec design Cinematic Noir
type: project
---

Refonte complète du portfolio effectuée en avril 2026.

**Why:** Le design précédent ressemblait à un template générique fait par IA. L'utilisateur voulait quelque chose de personnel, sobre, élégant, avec une identité Marvel-inspired.

**Design System:**
- Couleurs: bleu (#3B82F6) comme seul accent, noir profond (#050810 dark), blanc pur (light)
- Polices: Space Grotesk (titres) + Inter (corps), chargées via CDN Google Fonts
- Dark mode par défaut (next-themes, classe `.dark`)
- Bilingual FR/EN via context `hooks/use-language.tsx` + `lib/i18n.ts`
- Curseur custom (dot + ring) dans `components/ui/cursor.tsx`
- Animations: CSS pures (scroll reveal via IntersectionObserver, `.section-hidden/.section-visible`)

**Nouvelles sections:**
- Services (6 cartes: Web, Mobile, UX/UI, IoT, Cybersec, Sur mesure)
- Experience (timeline work + education)

**Structure des données:** `lib/data.ts` inclut skills (6 catégories), experiences, services, projects (9 projets dont CT ConstruTech et Souw Travel)

**How to apply:** Si l'utilisateur demande d'ajuster le design, rester dans la même philosophie : sobre, bleu comme seul accent, pas de gradient coloré.
