import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

/**
 * Interface pour étendre la requête Express avec un utilisateur
 * @extends Request
 * @property {any} user - Utilisateur décodé du token JWT
 */
interface ExtendRequest extends Request {
  user?: any;
}

// Middleware pour valider le token JWT
const validateJWT = async (
  req: ExtendRequest,
  res: Response,
  next: NextFunction
) => {
  // Récupération de l'en-tête d'autorisation
  const authorizationHeader = req.get("authorization");

  if (!authorizationHeader) {
    // Si l'en-tête d'autorisation n'est pas fourni, renvoyer une réponse 403 Forbidden
    res.status(403).send({ message: "Authorization header was not provided" });
    return;
  }
  // Récupération du token à partir de l'en-tête d'autorisation
  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    // Si le token n'est pas fourni, renvoyer une réponse 403 Forbidden
    res.status(403).send({ message: "Token was not provided" });
    return;
  }
  // Vérification du token

  jwt.verify(token, "Oc4CfI4P28h", async (err, payload) => {
    if (err) {
      // Si le token est invalide, renvoyer une réponse 403 Forbidden
      res.status(403).send({ message: "Invalid token" });
      return;
    }
    // Si le payload est nul, renvoyer une réponse 403 Forbidden
    if (!payload) {
      res.status(403).send({ message: "Invalid token" });
      return;
    }
    // Conversion du payload en any pour pouvoir accéder aux propriétés
    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
    };

    // Si le token est valide, ajouter les données décodées à la requête
    const user = await userModel.findOne({ email: userPayload.email });
    req.user = user;
    // Passer à la prochaine middleware
    next();
  });
};

export default validateJWT;
