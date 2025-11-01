// Import des modules nécessaires
import express from "express"; // Framework web pour Node.js (crée le serveur HTTP)
import mongoose from "mongoose"; // ODM (Object Data Modeling) pour MongoDB
import userRoute from "./routes/userRoute.js";
import { seedInitialProducts } from "./services/productService.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
// Création de l'application Express
// app sera notre serveur web qui va gérer les requêtes HTTP
const app = express();

// Définition du port sur lequel le serveur écoutera les requêtes
// Port 3001 pour éviter les conflits avec d'autres applications
const port = 3001;
// Middleware pour parser le corps des requêtes en JSON
// Cela permet de parser le corps des requêtes en JSON
// et de les rendre disponibles dans le body de la requête
// Cela permet de parser le corps des requêtes en JSON
app.use(express.json());

// ============================================================
// CONNEXION À LA BASE DE DONNÉES MONGODB
// ============================================================
// Utilisation de mongoose.connect() pour se connecter à MongoDB
// L'URL de connexion pointe vers MongoDB local sur le port par défaut (27017)
// et la base de données s'appelle "ecommerce"

// Routes pour les utilisateurs (Create, Read, Update, Delete)
app.use("/user", userRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);

// Initialiser les produits (après la connexion à MongoDB)
mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => {
    console.log("Mongo connected");
    seedInitialProducts().catch((err) => {
      console.log("Failed to seed products", err);
    });
  })
  .catch((err) => console.log("Failed to connect", err));


// ============================================================
// DÉMARRAGE DU SERVEUR HTTP
// ============================================================
// app.listen() démarre le serveur HTTP sur le port spécifié
// Le callback est exécuté une fois que le serveur est prêt
// Cela permet de confirmer que l'application est opérationnelle
app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});
// Note: À ce stade, on n'a pas encore de routes définies.
// Il faudra ajouter app.use(express.json()) pour parser le JSON
// et créer des routes pour gérer les requêtes CRUD sur les utilisateurs.
