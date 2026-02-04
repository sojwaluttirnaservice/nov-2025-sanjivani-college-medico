import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "../utils/instance";
import { showError, showSuccess } from "../utils/error";

export const useOrders = (pharmacyId) => {
  const queryClient = useQueryClient();

  const fetchOrders = async () => {
    const { data } = await instance.get(
      `/orders?pharmacyId=${pharmacyId || 1}`,
    );
    return data;
  };

  const fetchOrderDetails = async (id) => {
    const { data } = await instance.get(`/orders/${id}`);
    return data;
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await instance.patch(`/orders/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      showSuccess("Order status updated");
      queryClient.invalidateQueries(["orders", pharmacyId]);
    },
    onError: (error) => {
      showError(error, "Failed to update order");
    },
  });

  return {
    useOrdersQuery: () =>
      useQuery({
        queryKey: ["orders", pharmacyId],
        queryFn: fetchOrders,
      }),
    useOrderDetailsQuery: (id) =>
      useQuery({
        queryKey: ["order", id],
        queryFn: () => fetchOrderDetails(id),
        enabled: !!id,
      }),
    updateStatus: updateStatusMutation,
  };
};
