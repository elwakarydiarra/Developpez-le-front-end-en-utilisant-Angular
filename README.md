# 🏅 Application Médailles Olympiques - Angular

Cette application permet de visualiser les statistiques des pays participants aux Jeux Olympiques, incluant un diagramme circulaire pour le nombre total de médailles et un graphique par pays.

## 📦 Prérequis

Avant de démarrer, tu dois avoir installé :

- [Node.js](https://nodejs.org/) (version recommandée : 18.x ou supérieure)
- [Angular CLI](https://angular.io/cli) (commande : `npm install -g @angular/cli`)

---

## 🚀 Installation

1. **Clone le dépôt** :
   ```bash
   git clone https://github.com/elwakarydiarra/Developpez-le-front-end-en-utilisant-Angular.git
   cd Developpez-le-front-end-en-utilisant-Angular
   ```

2. **Installe les dépendances** :
   ```bash
   npm install
   ```

---

## ▶️ Lancer l'application

Exécute cette commande pour démarrer le serveur de développement Angular :

```bash
ng serve
```

Puis ouvre ton navigateur à l’adresse :

```
http://localhost:4200
```

---

## 🗂️ Structure du projet

- `src/app/pages/home` : composant de la page d’accueil avec le diagramme circulaire.
- `src/app/country-details` : composant de détail pour chaque pays.
- `src/assets/mock/olympic.json` : données statiques simulant une API.
- `src/app/core/services/olympic.service.ts` : service de gestion des données olympiques.

---

## 🧪 Tests (optionnel)

Si des tests ont été mis en place, lance-les avec :

```bash
ng test
```

---

## 📁 Build (pour production)

Pour générer une version optimisée de l’application :

```bash
ng build
```

---

## 📝 Remarques

- L'application utilise [`@swimlane/ngx-charts`](https://github.com/swimlane/ngx-charts) pour les graphiques.
- Les styles personnalisés sont définis dans les fichiers `.scss`.

---

## 📬 Contact

Pour toute question ou suggestion, merci de contacter jeannette@email.com.
