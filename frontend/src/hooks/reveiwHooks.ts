import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../API";
import { Review } from "../types/Review";

export const useGetAllReviews = () =>
  useQuery({
    queryKey: ["reviews"],
    queryFn: async () =>
      (await apiClient.get<{ message: string; reviews: Review[] }>("reviews"))
        .data,
  });

export const useGetTopReviews = () =>
  useQuery({
    queryKey: ["reviews", "top"],
    queryFn: async () =>
      (
        await apiClient.get<{ message: string; reviews: Review[] }>(
          "reviews/top"
        )
      ).data,
  });
export const useGetProductReviews = (idProduct: string) =>
  useQuery({
    queryKey: ["reviews", "product", idProduct],
    queryFn: async () =>
      (
        await apiClient.get<{ message: string; reviews: Review[] }>(
          `reviews/product/${idProduct}`
        )
      ).data,
  });

export const useGetOrderReviews = (idOrder: string) =>
  useQuery({
    queryKey: ["reviews", "order", idOrder],
    queryFn: async () =>
      (
        await apiClient.get<{ message: string; reviews: Review[] }>(
          `reviews/order/${idOrder}`
        )
      ).data,
  });
export const useAddReviewMutation = () =>
  useMutation({
    mutationFn: async (review: Review) =>
      (
        await apiClient.post<{ message: string; review: Review }>(
          "reviews",
          review
        )
      ).data,
  });

export const useEditReviewMutation = () =>
  useMutation({
    mutationFn: async (review: Review) =>
      (
        await apiClient.put<{ message: string }>(
          `reviews/${review._id}`,
          review
        )
      ).data,
  });

export const useDeleteReviewMutation = () =>
  useMutation({
    mutationFn: async (id: string) =>
      (await apiClient.delete<{ message: string }>(`reviews/${id}`)).data,
  });
