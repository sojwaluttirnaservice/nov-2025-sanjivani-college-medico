import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "../utils/instance";
import { showError, showSuccess } from "../utils/error";

export const useDelivery = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["delivery-profile"],
    queryFn: async () => {
      const { data } = await instance.get("/deliveries/profile");
      return data || null;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (profileData) => {
      const { data } = await instance.put("/deliveries/profile", profileData);
      return data?.profile;
    },
    onSuccess: (data) => {
      showSuccess("Profile saved!");
      queryClient.setQueryData(["delivery-profile"], data);
    },
    onError: (error) => {
      showError(error, "Failed to save profile");
    },
  });

  const activeDeliveriesQuery = useQuery({
    queryKey: ["active-deliveries"],
    queryFn: async () => {
      const { data } = await instance.get("/deliveries/active");
      return data || [];
    },
  });

  const historyQuery = useQuery({
    queryKey: ["delivery-history"],
    queryFn: async () => {
      const { data } = await instance.get("/deliveries/history");
      return data || [];
    },
  });

  const markDelivered = useMutation({
    mutationFn: async (orderId) => {
      // Reusing the orders endpoint as it handles the business logic for completion
      const { data } = await instance.patch(`/orders/${orderId}/deliver`);
      return data;
    },
    onSuccess: () => {
      showSuccess("Delivery completed successfully!");
      // Invalidate both active and history queries
      queryClient.invalidateQueries({ queryKey: ["active-deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["delivery-history"] });
    },
    onError: (error) => {
      showError(error, "Failed to update delivery status");
    },
  });

  return {
    activeDeliveriesQuery,
    historyQuery,
    markDelivered,
    profileQuery,
    updateProfile,
  };
};
