import productModel from "../models/productModel.js";

/**
 * Méthode pour récupérer tous les produits
 * Cette fonction récupère tous les produits de la base de données
 *
 * @returns {Promise<IProduct[]>} - Liste de tous les produits
 */
export const getAllProducts = async () => {
  try {
    const products = await productModel.find();
    return products;
  } catch (error) {
    throw error;
  }
};

/**
 * Méthode pour initialiser les produits
 * Cette fonction initialise les produits de la base de données
 *
 * @returns {Promise<IProduct[]>} - Liste de tous les produits
 */
export const seedInitialProducts = async () => {
  try {
    const products = [
      {
        title: "Dell Laptop",
        image:
          "https://m.media-amazon.com/images/I/61+9ew81AfL._AC_UF1000,1000_QL80_.jpg",
        price: 15000,
        stock: 10,
      },
      {
        title: "Asus Laptop",
        image:
          "https://dlcdnwebimgs.asus.com/gain/4cc342ab-c4fa-42a9-8619-a340f6119bec/w800",
        price: 25000,
        stock: 20,
      },
      {
        title: "HP Laptop",
        image:
          "https://www.hp.com/gb-en/shop/Html/Merch/Images/c06723377_1750x1285.jpg",
        price: 40000,
        stock: 8,
      },
    ];
    // Récupérer les produits existants 
    const existingProducts = await getAllProducts();

    if(existingProducts.length === 0) {
        // Insérer les produits si aucun produit n'existe dans la base de données
        await productModel.insertMany(products);
        console.log("Initial products seeded successfully");
    } else {
        // Afficher un message si les produits existent déjà dans la base de données
        console.log("Products already exist");
    }
  } catch (error) {
    // Afficher un message si la fonction échoue
    console.log("Failed to seed initial products", error);
  }
};
