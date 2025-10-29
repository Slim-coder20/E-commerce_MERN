import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
/**
 * Interface TypeScript pour les paramètres de la fonction register (inscription)
 * Elle définit la structure des données nécessaires pour créer un nouveau compte utilisateur
 */
interface RegisterParams {
  firstName: string; // Prénom de l'utilisateur
  lastName: string; // Nom de famille de l'utilisateur
  email: string; // Adresse email de l'utilisateur (servira d'identifiant unique)
  password: string; // Mot de passe en clair qui sera haché avant d'être stocké
}

/**
 * Méthode pour l'inscription d'un nouvel utilisateur
 * Cette fonction gère la création d'un compte utilisateur avec validation et sécurité
 *
 * Processus :
 * 1. Vérifie si l'email existe déjà dans la base de données (évite les doublons)
 * 2. Hache le mot de passe avec bcrypt pour sécuriser les données
 * 3. Crée un nouvel utilisateur dans la base de données
 * 4. Retourne le résultat avec un code de statut HTTP approprié
 *
 * @param {RegisterParams} {firstName, lastName, email, password} - Données de l'utilisateur à créer
 * @returns {Promise<{data: any, statusCode: number}>} - Résultat de l'opération avec données et code de statut
 */
export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterParams) => {
  // Recherche d'un utilisateur existant avec le même email
  // Si trouvé, cela signifie que l'email est déjà utilisé
  const findUser = await userModel.findOne({ email });

  // Validation : si l'utilisateur existe déjà, retourne une erreur 400 (Bad Request)
  // Cette vérification empêche la création de comptes multiples avec le même email
  if (findUser) {
    return { data: "user already exist", statusCode: 400 };
  }

  // Hachage du mot de passe avec bcrypt
  // Le 10 représente le "salt rounds" (nombre de tours de hachage)
  // Plus le nombre est élevé, plus c'est sécurisé mais aussi plus lent
  // Le password sera transformé en une chaîne de caractères hashée irreversible
  const hashedPassword = await bcrypt.hash(password, 10);

  // Création d'une nouvelle instance du modèle utilisateur
  // Le mot de passe hashé est stocké au lieu du mot de passe en clair
  const newUser = new userModel({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  // Sauvegarde du nouvel utilisateur dans la base de données (opération asynchrone)
  // Cette étape persiste les données dans MongoDB
  await newUser.save();

  // Retourne un succès avec le code de statut HTTP 200 (OK) et les données du nouvel utilisateur
  // Note : En production, on ne devrait généralement pas retourner toutes les données utilisateur
  // (notamment le mot de passe hashé)
  return {
    data: generateToken({ firstName, lastName, email }),
    statusCode: 200,
  };
};

/**
 * Interface TypeScript pour les paramètres de la fonction login (connexion)
 * Elle définit la structure des données nécessaires pour authentifier un utilisateur
 */
interface loginParams {
  email: string; // Adresse email de l'utilisateur (identifiant)
  password: string; // Mot de passe en clair à comparer avec celui de la base de données
}

/**
 * Méthode pour la connexion d'un utilisateur existant
 * Cette fonction gère l'authentification d'un utilisateur avec validation des identifiants
 *
 * Processus :
 * 1. Recherche l'utilisateur par email
 * 2. Vérifie si l'utilisateur existe
 * 3. Compare le mot de passe fourni avec le mot de passe hashé stocké
 * 4. Retourne le résultat avec un code de statut HTTP approprié
 *
 * Sécurité :
 * - Ne donne pas d'indication sur si l'email ou le mot de passe est incorrect
 * - Message d'erreur générique pour éviter les attaques par énumération
 *
 * @param {loginParams} {email, password} - Identifiants de connexion
 * @returns {Promise<{data: any, statusCode: number}>} - Résultat de l'opération avec données et code de statut
 */
export const login = async ({ email, password }: loginParams) => {
  // Recherche de l'utilisateur dans la base de données par son email
  // L'email sert d'identifiant unique pour localiser l'utilisateur
  const findUser = await userModel.findOne({ email });

  // Validation : si aucun utilisateur n'est trouvé avec cet email
  // Retourne un message d'erreur générique (ne précise pas si l'email existe ou non)
  // Cela évite les attaques par énumération qui tentent de découvrir quels emails existent
  if (!findUser) {
    return { data: "Incorrect email or password.", statusCode: 400 };
  }

  // Comparaison du mot de passe fourni avec le mot de passe hashé stocké
  // bcrypt.compare() dé-hache et compare les deux mots de passe de manière sécurisée
  // Retourne true si les mots de passe correspondent, false sinon
  const passwordMatch = await bcrypt.compare(password, findUser.password);

  // Validation : si le mot de passe ne correspond pas
  // Même message d'erreur générique pour maintenir la sécurité
  if (!passwordMatch) {
    return { data: "Incorrect email or password.", statusCode: 400 };
  }

  // Si toutes les validations passent, retourne un succès (code 200) avec les données de l'utilisateur
  // Note : En production, on générerait ici un token JWT pour maintenir la session
  return {
    data: generateToken({
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      email: findUser.email,
    }),
    statusCode: 200,
  };
};
/**
 * Génère un token JWT pour un utilisateur
 * Cette fonction crée un token JWT (JSON Web Token) pour un utilisateur
 * Le token est utilisé pour authentifier les requêtes futures
 *
 * @param {string} userId - ID de l'utilisateur pour lequel le token est généré
 * @returns {string} - Token JWT
 */
const generateToken = (data: any) => {
  return jwt.sign(data, "Oc4CfI4P28h", { expiresIn: "24h" });
};
