# SkillBoard

SkillBoard est une plateforme full-stack de suivi des compétences et des formations pour les entreprises. Elle permet aux équipes RH et aux managers de cartographier les compétences, planifier les formations et mesurer l'évolution globale grâce à un tableau de bord moderne.

## Sommaire
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Configuration](#configuration)
- [Démarrage en local](#démarrage-en-local)
- [Démarrage avec Docker](#démarrage-avec-docker)
- [Scripts disponibles](#scripts-disponibles)
- [Structure du projet](#structure-du-projet)
- [Modèles de données](#modèles-de-données)
- [API REST](#api-rest)
- [Tableau de bord & rapports](#tableau-de-bord--rapports)
- [Sécurité et rôles](#sécurité-et-rôles)

## Fonctionnalités
- 🔐 Authentification JWT et gestion de rôles (Admin / Utilisateur)
- 👥 Gestion complète des utilisateurs (profil, rôle, compétences, formations)
- 🧠 Gestion des compétences par collaborateur avec niveaux personnalisés
- 🎓 Suivi des formations avec statut (Planifié, En cours, Terminé) et historique
- 📊 Tableau de bord interactif (Recharts) : moyenne de compétences, taux de formation, répartition par statut
- 🗂️ Recherche et filtres dynamiques sur toutes les vues (utilisateurs, compétences, formations)
- 📄 Export des rapports RH en PDF consolidé
- 🎨 Interface React + Tailwind responsive

## Architecture
- **Frontend** : React 18, Vite, Tailwind CSS, Recharts, Axios
- **Backend** : Node.js, Express, MongoDB (Mongoose), JWT, PDFKit
- **Base de données** : MongoDB
- **Authentification** : JWT Bearer + bcryptjs
- **Déploiement** : Docker & docker-compose (services `frontend`, `backend`, `mongo`)

## Prérequis
- Node.js >= 18
- npm >= 9
- Docker & docker-compose (facultatif mais recommandé)
- MongoDB en local ou instance distante

## Configuration
1. Dupliquez les fichiers d'exemple d'environnement :
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Mettez à jour les variables :
   - `PORT` : port d'écoute de l'API (défaut : 5000)
   - `MONGODB_URI` : URL de connexion MongoDB
   - `JWT_SECRET` : secret de signature des tokens
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` : création auto d'un compte administrateur au démarrage

## Démarrage en local
### Backend
```bash
cd backend
npm install
npm run dev
```
L'API est disponible sur http://localhost:5000.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Le frontend est disponible sur http://localhost:3000 (proxy vers l'API).

## Démarrage avec Docker
```bash
docker-compose up --build
```
- Frontend : http://localhost:3000
- Backend : http://localhost:5000
- MongoDB : mongodb://localhost:27017 (volume persistant `skillboard_data`)

## Scripts disponibles
| Répertoire | Commande           | Description                                  |
|------------|--------------------|----------------------------------------------|
| backend    | `npm run dev`      | Lancer l'API en mode développement (nodemon) |
| backend    | `npm run start`    | Lancer l'API en production                   |
| frontend   | `npm run dev`      | Lancer le frontend (Vite)                    |
| frontend   | `npm run build`    | Build de production                          |
| frontend   | `npm run preview`  | Prévisualiser le build                       |

## Structure du projet
```
SkillBoard/
├── backend/
│   ├── src/
│   │   ├── config/         # Connexion MongoDB
│   │   ├── controllers/    # Logique métier des routes
│   │   ├── middleware/     # Authentification, erreurs
│   │   ├── models/         # Schémas Mongoose
│   │   ├── routes/         # Routes Express par module
│   │   └── utils/          # Helpers (token, réponses)
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # UI réutilisable (tables, modals, etc.)
│   │   ├── context/        # Contexte d'authentification
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── pages/          # Pages principales (Dashboard, Users...)
│   │   ├── services/       # Clients API Axios
│   │   └── utils/          # Constantes
│   ├── package.json
│   └── tailwind.config.cjs
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

## Modèles de données
### Utilisateur
```json
{
  "name": "string",
  "position": "string",
  "email": "string",
  "role": "Admin | Utilisateur",
  "password": "hash bcrypt",
  "skills": [
    { "name": "string", "level": "Débutant | Intermédiaire | Avancé | Expert" }
  ],
  "trainings": [
    {
      "title": "string",
      "provider": "string",
      "status": "Planifié | En cours | Terminé",
      "completionDate": "Date",
      "notes": "string"
    }
  ]
}
```

## API REST
Toutes les routes sont préfixées par `/api`. Les routes nécessitant un rôle Admin sont signalées.

### Authentification
| Méthode | Route          | Description             |
|---------|----------------|-------------------------|
| POST    | `/auth/login`  | Connexion (email + mdp) |
| POST    | `/auth/register` ⚠️ Admin | Création d'utilisateur |

### Utilisateurs (JWT requis)
| Méthode | Route           | Rôle    | Description               |
|---------|-----------------|---------|---------------------------|
| GET     | `/users`        | Tous    | Liste + filtres           |
| GET     | `/users/:id`    | Tous    | Détails utilisateur       |
| POST    | `/users`        | Admin   | Création                  |
| PUT     | `/users/:id`    | Admin   | Mise à jour               |
| DELETE  | `/users/:id`    | Admin   | Suppression               |

### Compétences (JWT requis)
| Méthode | Route                       | Rôle  | Description              |
|---------|-----------------------------|-------|--------------------------|
| GET     | `/skills`                   | Tous  | Liste globale            |
| GET     | `/skills?userId=:id`        | Tous  | Compétences d'un user    |
| POST    | `/skills/:userId`           | Admin | Ajouter une compétence   |
| PUT     | `/skills/:userId/:skillId`  | Admin | Modifier une compétence  |
| DELETE  | `/skills/:userId/:skillId`  | Admin | Supprimer une compétence |

### Formations (JWT requis)
| Méthode | Route                            | Rôle  | Description               |
|---------|----------------------------------|-------|---------------------------|
| GET     | `/trainings`                     | Tous  | Liste + filtres           |
| GET     | `/trainings?userId=:id`          | Tous  | Formations d'un user      |
| POST    | `/trainings/:userId`             | Admin | Ajouter une formation     |
| PUT     | `/trainings/:userId/:trainingId` | Admin | Modifier une formation    |
| DELETE  | `/trainings/:userId/:trainingId` | Admin | Supprimer une formation   |

### Tableau de bord
| Méthode | Route               | Rôle | Description                       |
|---------|---------------------|------|-----------------------------------|
| GET     | `/dashboard/metrics`| Tous | Statistiques agrégées             |
| GET     | `/dashboard/report` | Tous | Export PDF du rapport global      |

## Tableau de bord & rapports
- **Recharts** alimente des graphiques réactifs : bar chart (niveau moyen), pie chart (répartition des formations).
- **Export PDF** : `/api/dashboard/report` génère un PDF avec la synthèse des compétences et formations par collaborateur (PDFKit).

## Sécurité et rôles
- Authentification stateless via JWT (header `Authorization: Bearer <token>`).
- Hash des mots de passe via `bcryptjs`.
- Middleware d'autorisation sur les routes critiques (création/modification/suppression).
- Compte administrateur créé automatiquement à partir des variables d'environnement `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

---

> 💡 Pour toute contribution ou évolution, créez une branche dédiée, ouvrez une Pull Request et documentez vos changements dans le README si nécessaire.
