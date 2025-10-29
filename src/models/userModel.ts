// Import de mongoose pour créer le modèle de l'utilisateur
// Schema permet de définir la structure de la collection
// Document est l'interface de base pour tous les documents Mongoose
import mongoose, { Schema, Document } from "mongoose";

// Définition de l'interface TypeScript pour un utilisateur
// Cette interface étend Document (de Mongoose) pour ajouter des propriétés de gestion de base de données
// Chaque propriété représente un champ dans la collection "users" de MongoDB
export interface IUser extends Document {
  firstName: string; // Prénom de l'utilisateur
  lastName: string; // Nom de famille
  email: string; // Adresse e-mail (unique en général)
  password: string; // Mot de passe (doit être haché dans la pratique)
}

// Création du schéma MongoDB avec les contraintes de validation
// Le schéma définit la structure exacte de chaque document utilisateur
const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true }, // Champ obligatoire de type chaîne
  lastName: { type: String, required: true }, // Champ obligatoire de type chaîne
  email: { type: String, required: true }, // Champ obligatoire de type chaîne
  password: { type: String, required: true }, // Champ obligatoire de type chaîne
  // Note: Dans une application réelle, on ajouterait des validations supplémentaires
  // comme email unique, longueur minimale de mot de passe, etc.
});

// Création du modèle Mongoose à partir du schéma
// Le modèle permet d'interagir avec la collection "users" dans MongoDB
// 'User' est le nom du modèle (Mongoose le convertira en 'users' pour la collection)
const userModel = mongoose.model<IUser>("User", userSchema);

// Export du modèle pour l'utiliser dans les routes et services
export default userModel;
