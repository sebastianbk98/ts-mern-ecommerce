import { useMutation, useQuery } from "@tanstack/react-query";
import { CartItem, ShippingAddress } from "../types/Cart";
import apiClient from "../API";
import { Order } from "../types/Order";
import { User } from "../types/User";

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: {
      orderItems: CartItem[];
      shippingAddress: ShippingAddress;
      paymentMethod: string;
      itemsPrice: number;
      shippingPrice: number;
      taxPrice: number;
      totalPrice: number;
      user: User;
    }) => (await apiClient.post("orders", order)).data,
  });

export const useGetorderDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: async () => (await apiClient.get<Order>(`orders/${id}`)).data,
  });

export const usePayOrderMutation = () =>
  useMutation({
    mutationFn: async (paymentResult: {
      orderId: string;
      paymentId: string;
      status: string;
      emailAddress: string;
      updateTime: string;
    }) =>
      (
        await apiClient.put<{ message: string; order: Order }>(
          `orders/${paymentResult.orderId}/pay`,
          paymentResult
        )
      ).data,
  });

export const useDeliverOrderMutation = () =>
  useMutation({
    mutationFn: async (orderId: string) =>
      (
        await apiClient.put<{ message: string; order: Order }>(
          `orders/${orderId}/deliver`
        )
      ).data,
  });

export const useGetAllOrdersByUser = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: async () =>
      (await apiClient.get<{ message: string; orders: Order[] }>("orders/"))
        .data,
  });

export const useGetAllOrdersByAdmin = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: async () =>
      (
        await apiClient.get<{ message: string; orders: Order[] }>(
          "orders/admin"
        )
      ).data,
  });
