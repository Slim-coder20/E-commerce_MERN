import express from "express";
import { getAllProducts } from "../services/productService.js";

// Création d'un routeur Express pour gérer les routes liées aux produits
// Un routeur permet d'organiser les routes de manière modulaire
const router = express.Router();

router.get("/",  async (req, res) => {
  try {
    const products = await getAllProducts();
  res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ message: "Failed to get products" });
  }
});

export default router;