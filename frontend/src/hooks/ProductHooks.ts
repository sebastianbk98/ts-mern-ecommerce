import { useMutation, useQuery } from "@tanstack/react-query";
import { Product } from "../types/Product";
import apiClient from "../API";

export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => (await apiClient.get<Product[]>(`products`)).data,
  });

export const useGetLatestProductsQuery = () =>
  useQuery({
    queryKey: ["products", "latest"],
    queryFn: async () =>
      (await apiClient.get<Product[]>(`products/latest`)).data,
  });

export const useGetTop4ProductsQuery = () =>
  useQuery({
    queryKey: ["products", "top4"],
    queryFn: async () => (await apiClient.get<Product[]>(`products/top4`)).data,
  });

export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ["products", slug],
    queryFn: async () =>
      (await apiClient.get<Product>(`products/${slug}`)).data,
  });

export const useGetProductDetailsBySearchTermQuery = (
  searchTerm: string,
  pageNumber: number
) =>
  useQuery({
    queryKey: ["products", searchTerm, pageNumber],

    queryFn: async () =>
      (
        await apiClient.get<{
          products: Product[];
          page: number;
          pages: number;
        }>(
          `products/search?keyword=${encodeURIComponent(
            searchTerm
          )}&pageNumber=${pageNumber}`
        )
      ).data,
  });

export const useAddProductMutation = () =>
  useMutation({
    mutationFn: async (formData: FormData) =>
      (
        await apiClient.post<{ message: string; product: Product }>(
          "products/admin",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
      ).data,
  });

export const useEditProductMutation = () =>
  useMutation({
    mutationFn: async (product: Product) =>
      (
        await apiClient.put<{ message: string; product: Product }>(
          `products/admin/${product._id}`,
          product
        )
      ).data,
  });

export const useDeleteProductMutation = () =>
  useMutation({
    mutationFn: async (id: string) =>
      (await apiClient.delete<{ message: string }>(`products/admin/${id}`))
        .data,
  });
