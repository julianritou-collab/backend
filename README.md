# Mon Vieux Grimoire — Backend

**API REST Node.js/Express** pour back-end d'un site de notation de livres (**Projet 6 OC**)

## Prérequis

- Node.js (testé sur v22.20.0)
- Un compte [MongoDB Atlas](https://www.mongodb.com/atlas)

## Installation

```bash
npm install
```

Créer un fichier `.env` à partir du modèle :

```bash
copy .env.example .env
```

Renseigner les variables dans `.env` :

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
TOKEN_SECRET=une_chaine_aleatoire_longue_et_secrete
TOKEN_EXPIRES_IN=24h
SALT_ROUNDS=10
PORT=4000
FRONTEND_URL=http://localhost:3000
```

## Démarrage

```bash
node server.js
```

L'API est accessible sur `http://localhost:4000`.
Le Frontend doit tourner sur `http://localhost:3000` ( ou adapter **FRONTEND_URL** )

## Structure du projet

```
backend/
├── .env                    # Variables d'environnement (non versionné)
├── .env.example            # Modèle de configuration
├── app.js                  # Configuration Express, MongoDB, middlewares globaux
├── server.js               # Création du serveur HTTP et écoute du port
├── package.json            # Dépendances du projet
│
├── controllers/
│   ├── book.js             # Logique CRUD des livres + notation
│   └── user.js             # Inscription et connexion
│
├── middleware/
│   ├── auth.js             # Vérification JWT
│   ├── error-handler.js    # Gestion centralisée des erreurs
│   ├── image-optimizer.js  # Optimisation Sharp (resize + WebP)
│   └── multer-config.js    # Upload et filtrage des fichiers image
│
├── models/
│   ├── Book.js             # Schéma Mongoose livre
│   └── User.js             # Schéma Mongoose utilisateur (email unique)
│
├── routes/
│   ├── book.js             # 7 routes /api/books
│   └── user.js             # 2 routes /api/auth
│
└── images/                 # Images uploadées
```

## Routes de l'API

### Authentification

| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Créer un compte |
| POST | `/api/auth/login` | — | Se connecter |

### Livres

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/books` | — | Récupérer tous les livres |
| POST | `/api/books` | ✅ | Créer un livre |
| GET | `/api/books/bestrating` | — | Top 3 livres les mieux notés |
| GET | `/api/books/:id` | — | Récupérer un livre |
| PUT | `/api/books/:id` | ✅ | Modifier un livre |
| DELETE | `/api/books/:id` | ✅ | Supprimer un livre |
| POST | `/api/books/:id/rating` | ✅ | Noter un livre (1 note par utilisateur) |

## Outils utilisés

| Dépendance | Rôle |
|---|---|
| Express 5 | Framework HTTP |
| Mongoose | mapping objet JS <-> documents MongoDB |
| bcrypt | Hachage des mots de passe |
| jsonwebtoken | Authentification JWT |
| multer | Upload d'images |
| sharp | Optimisation des images (resize, WebP) |
| mongoose-unique-validator | Unicité des emails en base |
| dotenv | Variables d'environnement |

## Sécurité

- Mots de passe hachés avec **bcrypt**
- Authentification par **token JWT** sur toutes les routes d'écriture
- Vérification du **userId** avant modification/suppression d'un livre
- Emails uniques en base via `mongoose-unique-validator`
- Fichier `.env` exclu du versioning Git

## Green Code

- Images redimensionnées (max 463×595 px, sans agrandissement)
- Images converties et compressées en **WebP**
- Fichier temporaire supprimé immédiatement après traitement