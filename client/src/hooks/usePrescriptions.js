import { useQuery } from "@tanstack/react-query";
import { instance } from "../utils/instance";

export const usePrescriptions = (pharmacyId) => {
  const requestsQuery = useQuery({
    queryKey: ["prescription-requests", pharmacyId],
    queryFn: async () => {
      const { data } = await instance.get(
        `/prescriptions/requests?pharmacyId=${pharmacyId}`,
      );
      return data;
    },
    refetchInterval: 30000, // Poll every 30 seconds for new requests
    enabled: !!pharmacyId,
  });

  const usePrescriptionDetailQuery = (id) =>
    useQuery({
      queryKey: ["prescription-detail", id],
      queryFn: async () => {
        const { data } = await instance.get(`/prescriptions/analysis/${id}`);
        return data;
      },
      enabled: !!id,
    });

  return {
    requestsQuery,
    usePrescriptionDetailQuery,
  };
};
