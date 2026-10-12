# 🗓 Système de gestion de rendez-vous

Application web fullstack multi-rôles pour la gestion de rendez-vous — Spring Boot · React · JWT · MySQL

![Java](https://img.shields.io/badge/Java_17-orange?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL_8-4479A1?style=flat-square&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Stateless-red?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

---

## À propos

Plateforme complète de prise et de gestion de rendez-vous construite avec
une architecture REST stateless. Les demandeurs réservent des créneaux en
ligne, les employés publient leurs disponibilités, les gestionnaires
valident les demandes au quotidien et les administrateurs pilotent
l'ensemble via un tableau de bord analytique.

L'authentification repose sur des tokens JWT signés, avec une protection
par rôle sur chaque route frontend (`ProtectedRoute`) et backend
(Spring Security). Aucune session côté serveur.

---

## Fonctionnalités

- **Authentification JWT** — login/register, token Bearer, redirection
  automatique selon le rôle
- **Prise de RDV en ligne** — choix du service, créneaux libres en temps
  réel, confirmation en 2 étapes
- **Validation gestionnaire** — vue journalière, changement de statut
  (EN_ATTENTE → CONFIRMÉ → TERMINÉ)
- **Dashboard admin** — KPIs globaux, répartition par service, CRUD
  utilisateurs et jours fériés
- **Agenda employé** — publication des disponibilités, vue calendrier des
  RDV à venir
- **Notation** — les demandeurs notent les RDV terminés (1–5 étoiles)
- **Notifications** — badge en temps réel, marquage lu

---

## Rôles

| Rôle | Espace | Pages |
|---|---|---|
| `ROLE_ADMIN` | `/admin/*` | Utilisateurs, Services, Statistiques, Jours fériés |
| `ROLE_DEMANDEUR` | `/demandeur/*` | Prendre RDV, Mes RDV, Services |
| `ROLE_EMPLOYE` | `/employe/*` | Mon agenda, Disponibilités |
| `ROLE_GESTIONNAIRE` | `/gestionnaire/*` | Gestion RDV, Agenda global |

---

## Stack technique

| Couche | Technologies |
|---|---|
| Backend | Java 17 · Spring Boot 3 · Spring Security · Spring Data JPA |
| Frontend | React 18 · React Router v6 · Axios · Tailwind CSS |
| Base de données | MySQL 8 · Hibernate ORM |
| Sécurité | JWT stateless · BCrypt |
| Build | Maven · Vite · npm |

---

## Structure du projet

rdv-app/
├── backend/ ← Spring Boot (src/main/java/...)
│ ├── auth/ ← JWT filter, SecurityConfig
│ ├── controller/ ← REST controllers par domaine
│ ├── service/ ← logique métier
│ ├── repository/ ← Spring Data JPA
│ └── dto/ ← Request / Response records
│
└── frontend/ ← React (src/...)
├── api/ ← instance Axios + interceptor JWT
├── context/ ← AuthContext, NotifContext
├── services/ ← un fichier par endpoint
├── hooks/ ← useRendezVous, useDisponibilites...
├── components/ ← layouts, common, calendar
└── pages/ ← auth/, admin/, employe/, demandeur/, gestionnaire/

---

## Démarrage rapide

### Prérequis

- Java 17+
- Node.js 18+
- MySQL 8

### Backend

```bash
cd backend
# Configurer src/main/resources/application.properties
# spring.datasource.url=jdbc:mysql://localhost:3306/rdv_db
# spring.datasource.username=root
# spring.datasource.password=****
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

API disponible sur `http://localhost:8080/api/v1`  
Interface disponible sur `http://localhost:5173`

---

## Endpoints principaux

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Connexion → retourne JWT |
| `POST` | `/api/v1/auth/register` | Inscription demandeur |
| `GET` | `/api/v1/services` | Liste des services |
| `GET` | `/api/v1/disponibilites/service/{id}` | Créneaux libres |
| `POST` | `/api/v1/rendez-vous` | Réserver un créneau |
| `PATCH` | `/api/v1/rendez-vous/{id}/statut` | Valider / annuler |
| `GET` | `/api/v1/rendez-vous/mes-rdv` | RDV du demandeur |
| `GET` | `/api/v1/admin/statistiques/dashboard` | KPIs globaux |
| `GET` | `/api/v1/admin/utilisateurs` | Liste paginée |

> Tous les endpoints protégés requièrent `Authorization: Bearer <token>`

---

## Licence

MIT — libre d'utilisation, de modification et de distribution.

