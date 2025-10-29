import express from "express";
import { login, register } from "../services/userService.js";

// Création d'un routeur Express pour gérer les routes liées aux utilisateurs
// Un routeur permet d'organiser les routes de manière modulaire
const router = express.Router();

/**
 * Route POST pour l'inscription d'un nouvel utilisateur
 *
 * Point de terminaison : /register
 * Méthode HTTP : POST
 *
 * Fonctionnement :
 * 1. Reçoit les données d'inscription via le corps de la requête (request.body)
 * 2. Extrait les informations nécessaires (firstName, lastName, email, password)
 * 3. Appelle le service d'inscription qui valide et crée l'utilisateur
 * 4. Retourne une réponse HTTP avec le statut approprié et les données
 *
 * Corps de la requête attendu (JSON) :
 * {
 *   "firstName": "Jean",
 *   "lastName": "Dupont",
 *   "email": "jean.dupont@example.com",
 *   "password": "motdepasse123"
 * }
 *
 * Réponses possibles :
 * - 200 (OK) : Inscription réussie
 * - 400 (Bad Request) : Email déjà utilisé
 * - 500 (Internal Server Error) : Erreur serveur
 *
 * @param {express.Request} request - Objet requête Express contenant les données
 * @param {express.Response} response - Objet réponse Express pour envoyer la réponse HTTP
 */
router.post("/register", async (request, response) => {
  // Extraction des données envoyées par le client depuis le corps de la requête
  // Ces données proviennent du format JSON envoyé par le client (par exemple depuis un formulaire)
  const { firstName, lastName, email, password } = request.body;

  // Appel de la fonction de service register avec les données extraites
  // Cette fonction est asynchrone car elle fait des opérations de base de données
  // await attend que l'opération soit terminée avant de continuer
  const { statusCode, data } = await register({
    firstName,
    lastName,
    email,
    password,
  });

  // Envoi de la réponse HTTP au client
  // status() définit le code de statut HTTP (200, 400, etc.)
  // ?? 500 est un fallback : si statusCode est null ou undefined, utilise 500 (erreur serveur)
  // json() envoie les données au format JSON
  response.status(statusCode ?? 500).json(data);
});

/**
 * Route POST pour la connexion d'un utilisateur
 *
 * Point de terminaison : /login
 * Méthode HTTP : POST
 *
 * Fonctionnement :
 * 1. Reçoit les identifiants de connexion via le corps de la requête
 * 2. Extrait l'email et le mot de passe
 * 3. Appelle le service de connexion qui valide les identifiants
 * 4. Retourne une réponse HTTP avec le statut approprié et les données utilisateur
 *
 * Corps de la requête attendu (JSON) :
 * {
 *   "email": "jean.dupont@example.com",
 *   "password": "motdepasse123"
 * }
 *
 * Réponses possibles :
 * - 200 (OK) : Connexion réussie
 * - 400 (Bad Request) : Email ou mot de passe incorrect
 * - 500 (Internal Server Error) : Erreur serveur
 *
 * Note de sécurité :
 * Le message d'erreur est générique ("Incorrect email or password") pour éviter les
 * attaques par énumération qui tentent de découvrir quels emails existent dans le système
 *
 * @param {express.Request} request - Objet requête Express contenant les identifiants
 * @param {express.Response} response - Objet réponse Express pour envoyer la réponse HTTP
 */
router.post("/login", async (request, response) => {
  // Extraction des identifiants envoyés par le client depuis le corps de la requête
  const { email, password } = request.body;

  // Appel de la fonction de service login avec les identifiants
  // Cette fonction est asynchrone car elle fait des opérations de base de données
  // et de comparaison de mots de passe
  const { statusCode, data } = await login({ email, password });

  // Envoi de la réponse HTTP au client
  // status() définit le code de statut HTTP (200, 400, etc.)
  // ?? 500 est un fallback : si statusCode est null ou undefined, utilise 500 (erreur serveur)
  // json() envoie les données au format JSON
  response.status(statusCode ?? 500).json(data);
});

// Export du routeur pour qu'il puisse être utilisé dans d'autres fichiers (notamment dans index.ts)
export default router;
