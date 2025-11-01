import express from "express";
import { getActiveCartForUser } from "../services/cartService.js";
import validateJWT from "../middlewares/validateJWT.js";
// Création du router pour les routes de panier
const router = express.Router();

// Route pour obtenir le panier d'un utilisateur
router.get("/", validateJWT, async (req: any, res) => {
  const userId = req.user._id;
  const cart = await getActiveCartForUser({ userId: userId });
  res.status(200).send(cart);
});

// Route pour ajouter un produit au panier

export default router;
