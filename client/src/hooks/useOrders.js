import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "../utils/instance";
import { showError, showSuccess } from "../utils/error";

export const useOrders = (pharmacyId) => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["orders", pharmacyId],
    queryFn: async () => {
      const { data } = await instance.get(`/orders?pharmacyId=${pharmacyId}`);
      return data;
    },
    enabled: !!pharmacyId,
  });

  const statsQuery = useQuery({
    queryKey: ["order-stats", pharmacyId],
    queryFn: async () => {
      const { data } = await instance.get(
        `/orders/stats?pharmacyId=${pharmacyId}`,
      );
      return data;
    },
    enabled: !!pharmacyId,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await instance.patch(`/orders/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      showSuccess("Order status updated");
      queryClient.invalidateQueries(["orders", pharmacyId]);
      queryClient.invalidateQueries(["order-stats", pharmacyId]);
    },
    onError: (error) => {
      showError(error, "Failed to update order");
    },
  });

  const createOrder = useMutation({
    mutationFn: async (orderData) => {
      const { data } = await instance.post(`/orders`, orderData);
      return data;
    },
    onSuccess: () => {
      showSuccess("Order created successfully");
      queryClient.invalidateQueries(["orders", pharmacyId]);
      queryClient.invalidateQueries(["order-stats", pharmacyId]);
      queryClient.invalidateQueries(["prescription-requests", pharmacyId]);
    },
    onError: (error) => {
      showError(error, "Failed to create order");
    },
  });

  const useOrderDetailsQuery = (id) =>
    useQuery({
      queryKey: ["order", id],
      queryFn: async () => {
        const { data } = await instance.get(`/orders/${id}`);
        return data;
      },
      enabled: !!id,
    });

  return {
    ordersQuery,
    statsQuery,
    updateStatus,
    createOrder,
    useOrderDetailsQuery,
  };
};
