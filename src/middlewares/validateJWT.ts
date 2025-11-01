import type { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Middleware pour valider le token JWT
const validateJWT = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupération de l'en-tête d'autorisation
    const authorizationHeader = req.get("authorization");

    if (!authorizationHeader) {
      // Si l'en-tête d'autorisation n'est pas fourni, renvoyer une réponse 403 Forbidden
      res
        .status(403)
        .send({ message: "Authorization header was not provided" });
      return;
    }
    // Récupération du token à partir de l'en-tête d'autorisation
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      // Si le token n'est pas fourni, renvoyer une réponse 403 Forbidden
      res.status(403).send({ message: "Token was not provided" });
      return;
    }
    // Vérification du token en utilisant une promesse
    try {
      const payload = jwt.verify(token, "Oc4CfI4P28h") as {
        email: string;
        firstName: string;
        lastName: string;
      };

      // Si le token est valide, récupérer l'utilisateur de la base de données
      const user = await userModel.findOne({ email: payload.email });
      if (!user) {
        res.status(403).send({ message: "User not found" });
        return;
      }

      // Ajouter l'utilisateur à la requête
      req.user = user;
      // Passer à la prochaine middleware
      next();
    } catch (jwtError) {
      // Si le token est invalide, renvoyer une réponse 403 Forbidden
      res.status(403).send({ message: "Invalid token" });
      return;
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

export default validateJWT;
