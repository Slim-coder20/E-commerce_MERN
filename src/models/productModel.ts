import mongoose, { Schema, Document } from "mongoose";

// Définition de l'interface TypeScript pour un produit
// Cette interface étend Document (de Mongoose) pour ajouter des propriétés de gestion de base de données
// Chaque propriété représente un champ dans la collection "products" de MongoDB
export interface IProduct extends Document {
  title: string;
  image: string;
  price: number;
  stock: number;
}
// Création du schéma MongoDB avec les contraintes de validation
// Le schéma définit la structure exacte de chaque document produit
const productSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
});

// Export du modèle Mongoose pour être utilisé dans les autres fichiers
// Création du modèle Mongoose à partir du schéma
// Le modèle permet d'interagir avec la collection "products" dans MongoDB
// 'Product' est le nom du modèle (Mongoose le convertira en 'products' pour la collection)
const productModel = mongoose.model<IProduct>("Product", productSchema);

export default productModel;
