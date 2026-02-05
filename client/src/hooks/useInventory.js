import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "../utils/instance";
import { showError, showSuccess } from "../utils/error";

export const useInventory = (pharmacyId) => {
  const queryClient = useQueryClient();

  const fetchInventory = async () => {
    const { data } = await instance.get(
      `/inventory?pharmacyId=${pharmacyId || 1}`,
    );
    return data;
  };

  const addStockMutation = useMutation({
    mutationFn: async (stockData) => {
      const { data } = await instance.post("/inventory", {
        ...stockData,
        pharmacyId,
      });
      return data;
    },
    onSuccess: () => {
      showSuccess("Stock added successfully");
      queryClient.invalidateQueries(["inventory", pharmacyId]);
    },
    onError: (error) => {
      showError(error, "Failed to add stock");
    },
  });

  // Simple: Get batches for a medicine
  const getBatches = useCallback(
    async (medicineId) => {
      const { data } = await instance.get(
        `/inventory/batches?medicineId=${medicineId}&pharmacyId=${pharmacyId || 1}`,
      );
      return data;
    },
    [pharmacyId],
  );

  const checkAvailability = async (medicineId, quantity) => {
    const { data } = await instance.get(
      `/inventory/availability?medicineId=${medicineId}&quantity=${quantity}&pharmacyId=${pharmacyId || 1}`,
    );
    return data;
  };

  return {
    useInventoryQuery: () =>
      useQuery({
        queryKey: ["inventory", pharmacyId],
        queryFn: fetchInventory,
      }),
    addStock: addStockMutation,
    checkAvailability,
    getBatches,
  };
};
