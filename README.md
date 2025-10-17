# POC Model 3D - Analyse de Terrains par IA

Plateforme d'analyse de terrains et de recommandations d'investissement immobilier utilisant l'IA pour générer des modèles 3D et des analyses prédictives.

## 🎯 Objectif du POC

Créer une web-app interactive Next.js permettant de :

1. **Upload d'une photo de terrain** (ou sélection d'un exemple)
2. **Saisie de données** : localisation, surface, contraintes (inondable, pente, accès, etc.)
3. **Génération automatique** :
   - 🧠 Modèle 3D simplifié du terrain (via IA → fichier .glb)
   - 🤖 Analyse des contraintes et propositions de projets viables (résidentiel, hôtel, commercial, etc.)
   - 💬 Rapport avec recommandations d'investissements ciblées

## ✨ Fonctionnalités

- **Upload & Preview** : Importation de photos de terrains avec prévisualisation
- **Formulaire descriptif** : Saisie de localisation, surface, contraintes environnementales
- **Génération 3D automatique** : Création d'un modèle 3D .glb du terrain via API IA
- **Analyse IA multi-critères** : Vision par ordinateur + analyse contextuelle (GPT-4o)
- **Visualisation 3D interactive** : Rotation, zoom, inspection du modèle
- **Recommandations d'investissement** : Rapport détaillé avec types de projets et investisseurs cibles

## 🧩 Stack technique

### Frontend
- **Next.js 15** : Framework React avec App Router et Turbopack
- **React 19** : Bibliothèque UI
- **React Three Fiber** : Rendu et affichage des modèles 3D interactifs
- **@react-three/drei** : Helpers pour Three.js (OrbitControls, etc.)
- **Tailwind CSS 4** : Framework CSS utilitaire
- **shadcn/ui** : Composants UI professionnels (Form, Button, Card, etc.)
- **TypeScript** : Typage statique

### Backend / API
- **Next.js API Routes** : `/api/analyze-terrain`
- **Services IA** :
  - **Génération 3D** : Tripo3D / Meshy / Luma AI (photo → modèle .glb)
  - **Analyse vision** : OpenAI GPT-4o / GPT-4-Vision
- **Upload** : Gestion des fichiers multipart/form-data

## 📋 Prérequis

- Node.js 20+
- npm ou pnpm
- Clés API : OpenAI, Tripo3D (ou Meshy/Luma)

## 🚀 Installation

```bash
# Cloner le repository
git clone <votre-repo>
cd pocmodel3d

# Installer les dépendances
npm install
```

## ⚙️ Configuration

Créez un fichier `.env.local` à la racine du projet :

```env
# OpenAI (pour l'analyse)
OPENAI_API_KEY=sk-...

# Service de génération 3D
TRIPO3D_API_KEY=...

# URL de base
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 💻 Utilisation

### Mode développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build de production

```bash
npm run build
npm start
```

## 🔄 Workflow complet

### 1️⃣ L'utilisateur saisit les données

```json
{
  "photo": "terrain.jpg",
  "description": "Terrain de 3500m² à Marseille, zone légèrement inondable, proche d'une route principale."
}
```

### 2️⃣ Le backend traite (`/api/analyze-terrain`)

1. **Réception** : Photo + texte descriptif
2. **Génération 3D** : Appel à Tripo3D API → génère `/public/models/terrain_[id].glb`
3. **Analyse IA** : Appel à GPT-4o pour :
   - Analyser la photo (relief, végétation, bâtiments environnants)
   - Croiser avec la description
   - Déduire les contraintes réelles
   - Générer recommandations de projets et d'investisseurs

### 3️⃣ Le frontend affiche

- 🏞️ **Modèle 3D interactif** (rotation, zoom, inspection)
- 📄 **Rapport d'analyse IA** :
  ```
  Analyse IA :
  - Terrain en légère pente, risque d'inondation modéré
  - Végétation clairsemée, accès routier direct
  - Idées de projets :
    • Hôtel éco-touristique sur pilotis
    • Parc d'activités vertes
    • Résidence écologique surélevée
  - Investisseurs cibles : foncières locales, promoteurs éco-responsables
  ```

## 🧠 Prompt IA (exemple pour GPT-4o)

```
Analyse cette photo et cette description de terrain.

Photo : [image encodée en base64]
Description : {description de l'utilisateur}

Fournis une analyse structurée :
1. Contraintes principales (pente, végétation, inondation, accessibilité, urbanisme)
2. Points forts du terrain
3. Propose 3 projets d'aménagement possibles avec justifications
4. Types d'investisseurs à cibler pour chaque projet
5. Estimation du potentiel d'investissement (faible/moyen/élevé)

Format de réponse : JSON structuré.
```

## 📁 Structure du projet

```
pocmodel3d/
├── app/
│   ├── page.tsx                    # Page d'accueil avec formulaire
│   ├── layout.tsx                  # Layout principal
│   ├── globals.css                 # Styles globaux
│   └── api/
│       └── analyze-terrain/
│           └── route.ts            # Route API pour l'analyse
├── components/
│   ├── ui/                         # Composants shadcn/ui
│   ├── TerrainUploader.tsx         # Composant d'upload
│   ├── TerrainForm.tsx             # Formulaire de description
│   ├── ModelViewer.tsx             # Viewer 3D (React Three Fiber)
│   └── AnalysisReport.tsx          # Affichage du rapport IA
├── lib/
│   ├── ai/
│   │   ├── tripo3d.ts              # Client Tripo3D API
│   │   └── openai.ts               # Client OpenAI GPT-4o
│   └── utils.ts                    # Utilitaires
├── types/
│   ├── terrain.ts                  # Types TypeScript
│   └── api.ts                      # Types API
├── public/
│   ├── models/                     # Modèles 3D générés (.glb)
│   └── examples/                   # Photos d'exemple
└── README.md                       # Ce fichier
```

## 🛣️ Roadmap

### Phase 1 : MVP de base
- [x] Setup Next.js + TypeScript + Tailwind
- [ ] Interface d'upload de photos
- [ ] Formulaire de description (shadcn/ui)
- [ ] Integration shadcn/ui components

### Phase 2 : Génération 3D
- [ ] Intégration Tripo3D API (ou Meshy/Luma)
- [ ] Gestion du workflow asynchrone (génération peut prendre 30s-2min)
- [ ] Stockage des modèles .glb
- [ ] Viewer 3D avec React Three Fiber

### Phase 3 : Analyse IA
- [ ] Intégration OpenAI GPT-4o
- [ ] Prompt engineering pour l'analyse de terrain
- [ ] Parsing et structuration des réponses IA
- [ ] Affichage du rapport d'analyse

### Phase 4 : UX/UI
- [ ] États de chargement animés
- [ ] Gestion d'erreurs
- [ ] Photos d'exemple pré-chargées
- [ ] Mode responsive (mobile/tablet)

### Phase 5 : Fonctionnalités avancées
- [ ] Historique des analyses (base de données)
- [ ] Comparaison de plusieurs terrains
- [ ] Export PDF du rapport
- [ ] Partage de lien public
- [ ] Authentification utilisateur

## 🔌 APIs tierces utilisées

### Génération 3D (choisir une option)

| Service | Endpoint | Input | Output | Prix |
|---------|----------|-------|--------|------|
| **Tripo3D** | `POST /v2/openapi/upload` | Image | .glb | ~$0.02/model |
| **Meshy** | `POST /v1/image-to-3d` | Image | .glb | ~$0.05/model |
| **Luma AI** | `POST /api/generate` | Image | .glb | ~$0.10/model |

### Analyse IA

- **OpenAI GPT-4o** : Vision + texte → analyse structurée
  - `POST https://api.openai.com/v1/chat/completions`
  - ~$0.01 par analyse

## 🧪 Exemple de réponse API

```typescript
// POST /api/analyze-terrain
{
  "modelUrl": "/models/terrain_abc123.glb",
  "analysis": {
    "constraints": {
      "flood_risk": "moderate",
      "slope": "slight",
      "access": "direct_road",
      "vegetation": "sparse"
    },
    "strengths": [
      "Accès routier direct",
      "Surface importante (3500m²)",
      "Proximité Marseille centre"
    ],
    "projects": [
      {
        "type": "eco_hotel",
        "description": "Hôtel éco-touristique sur pilotis",
        "justification": "Mitigation risque inondation + attractivité touristique"
      },
      {
        "type": "green_park",
        "description": "Parc d'activités vertes",
        "justification": "Valorisation de la surface, faible impact environnemental"
      }
    ],
    "investors": [
      "Foncières locales spécialisées tourisme durable",
      "Promoteurs éco-responsables",
      "Fonds d'investissement ESG"
    ],
    "potential": "medium-high"
  },
  "processingTime": 45000
}
```

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir des issues ou des pull requests.

## 📄 Licence

MIT

## 👨‍💻 Auteur

Tony BN

---

**Note** : Ce projet est un POC (Proof of Concept) démontrant l'utilisation de l'IA générative pour l'analyse de terrains et l'aide à la décision en investissement immobilier.
