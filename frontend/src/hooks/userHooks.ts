import { useMutation } from "@tanstack/react-query";
import apiClient from "../API";
import { User } from "../types/User";

export const useSignInMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) =>
      (
        await apiClient.post<User>("users/signin", {
          email,
          password,
        })
      ).data,
  });

export const useSignUpMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) =>
      (
        await apiClient.post<User>("users/signup", {
          name,
          email,
          password,
        })
      ).data,
  });
