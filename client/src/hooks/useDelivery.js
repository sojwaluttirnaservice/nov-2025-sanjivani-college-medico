import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "../utils/instance";
import { showError, showSuccess } from "../utils/error";

export const useDelivery = () => {
  const queryClient = useQueryClient();

  const activeDeliveriesQuery = useQuery({
    queryKey: ["active-deliveries"],
    queryFn: async () => {
      const { data } = await instance.get("/deliveries/active");
      return data;
    },
  });

  const historyQuery = useQuery({
    queryKey: ["delivery-history"],
    queryFn: async () => {
      const { data } = await instance.get("/deliveries/history");
      return data;
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
      queryClient.invalidateQueries(["active-deliveries"]);
      queryClient.invalidateQueries(["delivery-history"]);
    },
    onError: (error) => {
      showError(error, "Failed to update delivery status");
    },
  });

  return {
    activeDeliveriesQuery,
    historyQuery,
    markDelivered,
  };
};
