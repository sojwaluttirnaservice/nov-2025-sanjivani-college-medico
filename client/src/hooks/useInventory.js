import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "../utils/instance";
import { showError, showSuccess } from "../utils/error";

export const useInventory = (pharmacyId) => {
  const queryClient = useQueryClient();

  const inventoryQuery = useQuery({
    queryKey: ["inventory", pharmacyId],
    queryFn: async () => {
      const { data } = await instance.get(
        `/inventory?pharmacyId=${pharmacyId}`,
      );
      return data;
    },
    enabled: !!pharmacyId,
  });

  const addStock = useMutation({
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
        `/inventory/batches?medicineId=${medicineId}&pharmacyId=${pharmacyId}`,
      );
      return data;
    },
    [pharmacyId],
  );

  const lowStockQuery = useQuery({
    queryKey: ["low-stock", pharmacyId],
    queryFn: async () => {
      const { data } = await instance.get(
        `/inventory/alerts/low-stock?pharmacyId=${pharmacyId}`,
      );
      return data;
    },
    enabled: !!pharmacyId,
  });

  const searchMedicines = useCallback(async (query) => {
    const { data } = await instance.get(`/medicines/search?q=${query}`);
    return data;
  }, []);

  const checkAvailability = async (medicineId, quantity) => {
    const { data } = await instance.get(
      `/inventory/availability?medicineId=${medicineId}&quantity=${quantity}&pharmacyId=${pharmacyId}`,
    );
    return data;
  };

  return {
    inventoryQuery,
    lowStockQuery,
    addStock,
    checkAvailability,
    getBatches,
    searchMedicines,
  };
};
