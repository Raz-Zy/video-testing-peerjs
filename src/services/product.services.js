import { headerToken } from "@/app/api/headerToken";

const API_URL = process.env.PUBLIC_API_URL;

export const getAllCategoriesService = async () => {
  const headers = await headerToken();
  try {
    const res = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: headers,
      next: {tags: ["categories"]}
    });
    const categories = await res.json();

    if (categories.status != "200 OK"){
      console.log("Error: ", categories);
    }

    return categories;
  }
  catch (error) {
    console.log("Error: ", error);
  }
};

export const getCategoryByIdService = async (categoryId) => {
  const headers = await headerToken();
  try {
    const res = await fetch(`${API_URL}/categories/${categoryId}`, {
      method: "GET",
      headers: headers,
      next: {tags: ["categories"]}
    });
    
    const category = await res.json();
    if (category.status != "200 OK"){
      console.log("Error: ", category);
    }

    return category;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const getProductsService = async () => {
  const headers = await headerToken();
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: "GET",
      headers: headers,
      next: {tags: ["products"]}
    });

    const products = await res.json();
    if (products.status != "200 OK"){
      console.log("Error: ", products);
    }

    return products;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const getProductByIdService = async (productId) => {
  const headers = await headerToken();
  try {
    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: "GET",
      headers: headers,
    });
    const product = await res.json();
    if (product.status != "200 OK"){
      console.log("Error: ", product);
    }

    return product;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const createProductService = async (product) => {
  const headers = await headerToken();
  console.log("headers: ", headers);
  console.log("product: ", JSON.stringify(product));

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(product),
      next: {tags: ["products"]}
    });
    const createdProduct = await res.json();

    console.log("createdProduct: ", createdProduct);

    if (createdProduct.status != "201 CREATED"){
      console.log("Error: ", createdProduct);
    }

    return createdProduct;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateProductService = async (product, productId) => {
  const headers = await headerToken();
  try {
    console.log("product: ", JSON.stringify(product.sizes));
    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(product),
      next: {tags: ["products"]}
    });
    const updatedProduct = await res.json();
    if (updatedProduct.status != "200 OK"){
      console.log("Error: ", updatedProduct);
    }

    return updatedProduct;
  } catch (error) {
    console.log("Error: ", error);
  }
}

export const deleteProductService = async (productId) => {
  const headers = await headerToken();
  try {
    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: "DELETE",
      headers: headers,
      next: {tags: ["products"]}
    });
    const deletedProduct = await res.json();
    if (deletedProduct.status != "200 OK"){
      console.log("Error: ", deletedProduct);
    }

    return deletedProduct;
  }
  catch (error) {
    console.log("Error: ", error);
  }
}

export const orderProductsService = async (order) => {
  const headers = await headerToken();
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(order),
      next: {tags: ["orders"]}
    });
    const orderedProducts = await res.json();
    if (orderedProducts.status != "200 CREATED"){
      console.log("Error: ", orderedProducts);
    }

    return orderedProducts;
  }
  catch (error) {
    console.log("Error: ", error);
  }
}

export const getOrdersService = async () => {
  const headers = await headerToken();
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "GET",
      headers: headers,
      next: {tags: ["orders"]}
    });
    const orders = await res.json();
    if (orders.status != "200 OK"){
      console.log("Error: ", orders);
    }

    return orders;
  }
  catch (error) {
    console.log("Error: ", error);
  }
}

export const getBestSellingProductsService = async () => {
  const headers = await headerToken();
  try {
    const res = await fetch(`${API_URL}/products/top-selling?limit=4`, {
      method: "GET",
      headers: headers,
      next: {tags: ["products"]}
    });
    const bestSellingProducts = await res.json();
    if (bestSellingProducts.status != "200 OK"){
      console.log("Error: ", bestSellingProducts);
    }

    return bestSellingProducts;
  }
  catch (error) {
    console.log("Error: ", error);
  }
}

export const ratingProductService = async (productId, stars) => {
  const headers = await headerToken();
  try {
    const res = await fetch(`${API_URL}/products/${productId}/rating?star=${stars}`, {
      method: "PATCH",
      headers: headers,
      next: {tags: ["products"]}
    });
    const ratingProduct = await res.json();
    if (ratingProduct.status != "200 OK") {
      console.log("Error: ", ratingProduct);
    }

    return ratingProduct;
  } catch (error) {
    console.log("Error: ", error);
  }
};