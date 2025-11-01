import cartModel from "../models/cartModel.js";

// Interface pour la création d'un panier pour un utilisateur
interface CreateCartForUser {
  userId: string;

  // Fonction pour créer un panier pour un utilisateur
  // Retourne le panier créé
  // Si l'utilisateur n'a pas de panier, crée un nouveau panier
  // Si l'utilisateur a un panier, retourne le panier existant
}
const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ 
    userId,
    items: [],
    totalAmount: 0,
    status: "active"
  });
  return cart;
};

// Fonction pour récupérer le panier actif pour un utilisateur
// Retourne le panier actif
// Si l'utilisateur n'a pas de panier actif, retourne null
// Si l'utilisateur a un panier actif, retourne le panier actif

interface GetActiveCartForUser {
  userId: string;
}
export const getActiveCartForUser = async ({
  userId,
}: GetActiveCartForUser) => {
  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCartForUser({ userId });
  }
  return cart;
};
