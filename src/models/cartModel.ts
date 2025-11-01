import mongoose, { Schema, Document } from "mongoose";
import type { ObjectId } from "mongoose";
import type { IProduct } from "./productModel.js";

// Enum pour le statut du panier
const CartStatusEnum = ["active", "completed"];

// Interface pour un item de panier
export interface ICartItem extends Document {
  product: IProduct;
  unitPrice: number;
  quantity: number;
}

// Interface pour un panier
export interface ICart extends Document {
  userId: ObjectId | string;
  items: ICartItem[];
  totalAmount: number;
  status: "active" | "completed";
}

// Création du schéma MongoDB avec les contraintes de validation //
// Schema permet de définir la structure de la collection
// Document est l'interface de base pour tous les documents Mongoose
// Schema pour l'item de panier
const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

// Schema pour le panier
// Schema permet de définir la structure de la collection
// Document est l'interface de base pour tous les documents Mongoose
const CartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [CartItemSchema], required: false, default: [] },
  totalAmount: { type: Number, required: false, default: 0 },
  status: { type: String, enum: CartStatusEnum, default: "active" },
});

// Création du modèle MongoDB
// mongoose.model est une méthode pour créer un modèle MongoDB
// ICart est l'interface pour le modèle
// "Cart" est le nom de la collection
// CartSchema est le schéma pour la collection
const CartModel = mongoose.model<ICart>("Cart", CartSchema);

export default CartModel;
