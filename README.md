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
