# 🚀 Velora Portfolio — Site Web Futuriste

Site portfolio complet pour développeur logiciel avec gestion de produits, devis clients, authentification et espace client.

## 🛠 Stack Technique

- **Frontend** : React 18 + Vite + React Router
- **Backend/DB** : Supabase (PostgreSQL + Auth + Realtime)
- **Déploiement** : Render (gratuit)
- **Design** : CSS custom, Orbitron + Syne fonts, thème dark futuriste

## 📁 Structure du projet

```
velora-portfolio/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Navigation avec auth
│   │   ├── Footer.jsx       # Pied de page complet
│   │   ├── Cursor.jsx       # Curseur personnalisé
│   │   └── Toast.jsx        # Notifications
│   ├── pages/
│   │   ├── HomePage.jsx     # Accueil + produits à la une
│   │   ├── AProposPage.jsx  # À propos + équipe + timeline
│   │   ├── ServicesPage.jsx # Services + prix + processus
│   │   ├── PortfolioPage.jsx# Portfolio avec filtres
│   │   ├── ProduitsPage.jsx # Produits + vidéo + devis
│   │   ├── ContactPage.jsx  # Formulaire de contact
│   │   ├── DevisPage.jsx    # Demande de devis
│   │   ├── MonComptePage.jsx# Espace client
│   │   └── AuthPages.jsx    # Connexion + inscription
│   ├── hooks/
│   │   └── useAuth.jsx      # Context authentification
│   ├── lib/
│   │   └── supabase.js      # Client Supabase + SQL schema
│   ├── App.jsx              # Routes
│   ├── main.jsx             # Entrée
│   └── index.css            # Design system complet
├── render.yaml              # Config déploiement Render
└── .env.example             # Variables d'environnement
```

## ⚙️ Installation locale

```bash
# 1. Cloner / décompresser le projet
cd velora-portfolio

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Modifier .env avec vos clés Supabase

# 4. Lancer en développement
npm run dev
```

## 🗄️ Configuration Supabase

### 1. Créer un projet Supabase
- Aller sur [supabase.com](https://supabase.com)
- Créer un nouveau projet
- Copier l'URL et la clé anon dans `.env`

### 2. Exécuter le SQL Schema
Dans Supabase → SQL Editor, coller et exécuter le code SQL qui se trouve en commentaires dans `src/lib/supabase.js`

### 3. Configurer l'authentification
- Supabase → Authentication → Providers → Email : activer
- Pour les emails de confirmation, configurer un SMTP (optionnel)

## 🌐 Déploiement sur Render (gratuit)

### 1. Pousser sur GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-username/velora-portfolio
git push -u origin main
```

### 2. Déployer sur Render
1. Aller sur [render.com](https://render.com) → New → Web Service
2. Connecter votre repo GitHub
3. Render détecte automatiquement `render.yaml`
4. Dans Environment Variables, ajouter :
   - `VITE_SUPABASE_URL` = votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` = votre clé anon

### 3. Configuration Build
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm run start`
- **Plan** : Free

## ✏️ Personnalisation

### Modifier les infos de contact
Dans `src/components/Footer.jsx` et `src/pages/ContactPage.jsx`

### Changer le nom "Velora"
Rechercher et remplacer "Velora" dans tous les fichiers

### Ajouter des produits via Supabase
- Dans Supabase → Table Editor → products
- Champs importants :
  - `title`, `description`, `long_description`
  - `image_url` : URL d'une image hébergée
  - `video_url` : URL YouTube embed (ex: `https://www.youtube.com/embed/ID`)
  - `is_featured` : true = à la une
  - `is_discover` : true = à découvrir
  - `tags` : tableau de tags ex: `["React","Node.js"]`

### Couleurs du thème
Dans `src/index.css`, modifier les variables CSS :
```css
--cyan: #00f5ff;      /* Couleur principale */
--teal: #00c9a7;      /* Couleur secondaire */
--accent: #7c3aed;    /* Accent violet */
--bg: #020408;        /* Fond principal */
```

## 📧 Emails automatiques (optionnel)

Pour envoyer des emails automatiques lors d'un nouveau devis, configurer Supabase Edge Functions avec Resend ou SendGrid.

## 🔐 Sécurité

- Row Level Security (RLS) activé sur Supabase
- Les clients voient uniquement leurs propres devis
- Authentification gérée par Supabase Auth
- Variables d'environnement côté serveur pour les clés sensibles

## 📞 Support

Pour toute question sur ce projet : contact@velora.dev
