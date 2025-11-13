# Direction Artistique : Galactic Finance

Ce document définit la direction artistique et l'identité visuelle de **Cash-Center.fun**.

## 1. Concept Général

Le thème est **"Galactic Finance"** ou **"Cyber-Cash"**. C'est une fusion entre la finance, la technologie futuriste et l'esthétique de l'espace. L'idée est de présenter les gains en ligne comme une aventure high-tech, évoquant les flux de données, les réseaux galactiques et l'énergie numérique. L'utilisateur n'est pas juste en train de cliquer, il "mine" de la "CASH" numérique dans un univers stylisé.

## 2. Palette de Couleurs

La palette est conçue pour être sombre, immersive et énergique.

- **Fond (Background) :** Des bleus très sombres, presque noirs (`#0a0f1e`), simulant la profondeur de l'espace. Des dégradés radiaux subtils avec des teintes d'accentuation créent une impression de nébuleuse ou d'énergie lointaine.
- **Couleur Primaire (Accent Principal) :** Un **Cyan/Teal vif et lumineux** (`#00e5ff`). C'est la couleur de l'énergie, des données, de l'argent numérique ("CASH"). Elle est utilisée pour les boutons, les liens, les icônes importantes et tout ce qui est interactif. L'effet de "lueur" (glow) est essentiel sur cette couleur.
- **Couleurs Secondaires :** Des bleus plus sombres et désaturés (`#2c3e50`). Utilisés pour les cartes, les conteneurs et les éléments d'arrière-plan pour créer de la profondeur sans détourner l'attention.
- **Texte :**
  - **Corps :** Blanc cassé ou gris très clair pour une lisibilité optimale sur fond sombre.
  - **Secondaire / Muted :** Gris clair (`#bdc3c7`) pour les descriptions et les informations moins importantes.
- **Destructive :** Un rouge ou orange vif pour les actions de suppression, les erreurs et les avertissements.

## 3. Typographie

- **Titres (Headlines - `Space_Grotesk`) :** Une police de caractères moderne, géométrique, et légèrement "tech". Elle est audacieuse et utilisée pour les grands titres pour donner un impact fort.
- **Corps de texte (Body - `Inter`) :** Une police sans-serif très lisible et neutre pour les paragraphes, descriptions et labels, garantissant un confort de lecture.

## 4. Iconographie et Formes

- **Icônes (`lucide-react`) :** Des icônes fines, linéaires et modernes qui complètent l'aspect technologique.
- **Formes :** Des coins arrondis (`rounded-xl`) sur les cartes et les boutons pour un look doux et moderne.
- **Effet "Glassmorphism" (`glass-card`) :** Les cartes ont un fond semi-transparent avec un flou d'arrière-plan. Cela renforce l'idée d'écrans holographiques et d'interfaces futuristes superposées.

---

## 2. Master Prompt pour l'IA

> Voici le prompt de référence à utiliser pour toute demande de création ou de modification de composants, de pages ou de fonctionnalités pour le projet **Cash-Center.fun**.
> 
> **Instructions Générales :**
> 
> 1.  **Respecter la Direction Artistique "Galactic Finance" :**
>     -   **Thème :** Futuriste, technologique, spatial, lié à la finance numérique.
>     -   **Palette :** Fond bleu très sombre, accents **cyan vifs et lumineux**, et secondaires bleus plus ternes. Utiliser les variables CSS existantes (`--primary`, `--background`, `--card`, etc.). Ne pas utiliser de couleurs en dur (ex: `text-red-500`).
>     -   **Composants :** Utiliser les composants `shadcn/ui` existants. Privilégier l'effet **"Glassmorphism"** pour les conteneurs principaux en appliquant la classe `glass-card`.
>     -   **Typographie :** Utiliser la police `font-headline` pour les titres et `font-body` pour le texte.
>     -   **Iconographie :** Utiliser la bibliothèque `lucide-react` pour les icônes.
> 
> 2.  **Qualité du Code (Next.js & React) :**
>     -   Utiliser les **Server Components** par défaut. N'utiliser `'use client'` que lorsque c'est indispensable (hooks, interactivité).
>     -   Le code doit être propre, bien organisé, et sans commentaires inutiles.
>     -   Assurer la responsivité (mobile-first si possible).
> 
> 3.  **Intégration Firebase :**
>     -   Utiliser les hooks fournis (`useAuth`, `useFirestore`, `useCollection`, `useUser`) pour interagir avec Firebase.
>     -   Toutes les interactions avec la base de données doivent se faire côté client (`'use client'`).
>     -   Respecter scrupuleusement les règles de sécurité existantes dans `firestore.rules`.
