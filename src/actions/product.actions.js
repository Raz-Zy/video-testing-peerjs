"use server";

import {
  getAllCategoriesService,
  getProductsService,
  createProductService,
  getCategoryByIdService,
  updateProductService,
  deleteProductService,
  orderProductsService,
  getOrdersService,
  getBestSellingProductsService,
  ratingProductService,
} from "@/services/product.services";
import { revalidateTag } from "next/cache";

export const getAllCategoriesAction = async () => {
  return await getAllCategoriesService();
};

export const getCategoryByIdAction = async (categoryId) => {
  return await getCategoryByIdService(categoryId);
};

export const getProductsAction = async () => {
  const products = await getProductsService();
  return products;
};

export const createProductAction = async (product) => {
  const createdProduct = await createProductService(product);
  revalidateTag("products");
  return createdProduct;
};

export const updateProductAction = async (product, productId) => {
  const updatedProduct = await updateProductService(product, productId);
  revalidateTag("products");
  return updatedProduct;
};

export const deleteProductAction = async (productId) => {
  const deletedProduct = await deleteProductService(productId);
  revalidateTag("products");
  return deletedProduct;
};

export const orderProductsAction = async (order) => {
  const orderedProducts = await orderProductsService(order);
  revalidateTag("orders");
  return orderedProducts;
};

export const getOrdersAction = async () => {
  return await getOrdersService();
};

export const getBestSellingProductsAction = async () => {
  return await getBestSellingProductsService();
};

export const ratingProductAction = async (productId, stars) => {
  const ratingProduct = await ratingProductService(productId, stars);
  revalidateTag("products");
  return ratingProduct;
};