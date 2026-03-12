# 🚨 Projet Alerte - Application d'Alerte

Une application moderne conçue avec **Angular 19** pour la gestion et l'envoi d'alertes personnalisées.

## 📋 Présentation

Projet Alerte est une interface intuitive permettant aux utilisateurs de configurer des notifications ou des alertes spécifiques. L'application utilise les dernières fonctionnalités d'Angular, notamment le rendu côté serveur (SSR) pour des performances optimales.

## ✨ Fonctionnalités

- **Interface d'Alerte** : Un formulaire dédié pour configurer le type d'application et le message d'alerte.
- **Sélection de Date/Heure** : Support natif pour la programmation précise des alertes.
- **Architecture Moderne** : Utilisation de composants Angular isolés et de SCSS pour le stylisage.
- **Support SSR** : Optimisation pour le moteur de recherche et chargement rapide via Angular SSR.

## 🚀 Installation de A à Z

### Prérequis

Assurez-vous d'avoir installé les éléments suivants sur votre machine :
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-depot>
   cd projet_alerte
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

## 🛠️ Utilisation

### Mode Développement

Pour lancer l'application en local avec rechargement automatique :
```bash
npm start
```
L'application sera disponible sur `http://localhost:4200`.

### Production / Build

Pour générer les fichiers de production :
```bash
npm run build
```

### Exécution avec SSR (Node.js)

Pour tester le rendu côté serveur :
```bash
npm run serve:ssr:projet_alerte
```

## 📁 Structure du Projet

- `src/app/` : Contient les composants logiques et les routes.
  - `interface-alerte/` : Composant principal pour la saisie des alertes.
- `public/` : Ressources statiques.
- `angular.json` : Configuration du framework Angular.
- `package.json` : Liste des dépendances et scripts de lancement.

## 🧰 Technologies utilisées

- **Framework** : Angular 19.2
- **Langage** : TypeScript
- **Style** : SCSS (Sass)
- **Backend (SSR)** : Express.js
- **Gestionnaire de paquets** : NPM

---
*Réalisé avec ❤️ pour la gestion simplifiée des alertes.*
