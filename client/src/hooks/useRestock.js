import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "../utils/instance";
import { showError, showSuccess } from "../utils/error";

/**
 * Hook for Pharmacy side:
 *   - fetch all restock requests for this pharmacy
 *   - create a new restock request
 *   - cancel a pending restock request
 *   - get all delivery agents (to pick one when requesting)
 */
export const useRestock = (pharmacyId) => {
  const queryClient = useQueryClient();

  // Pharmacy's restock requests list
  const restockRequestsQuery = useQuery({
    queryKey: ["restock-requests", pharmacyId],
    queryFn: async () => {
      const { data } = await instance.get(`/restock?pharmacy_id=${pharmacyId}`);
      return data?.data || [];
    },
    enabled: !!pharmacyId,
  });

  // All delivery agents for the pharmacy to choose from
  const agentsQuery = useQuery({
    queryKey: ["delivery-agents-list"],
    queryFn: async () => {
      const { data } = await instance.get("/restock/agents");
      return data?.data || [];
    },
  });

  // Create a new restock request
  const createRestockRequest = useMutation({
    mutationFn: async (requestData) => {
      const { data } = await instance.post("/restock", {
        ...requestData,
        pharmacy_id: pharmacyId,
      });
      return data?.data;
    },
    onSuccess: () => {
      showSuccess("Restock request sent to delivery agent!");
      queryClient.invalidateQueries(["restock-requests", pharmacyId]);
    },
    onError: (error) => {
      showError(error, "Failed to create restock request");
    },
  });

  // Cancel a pending restock request
  const cancelRestockRequest = useMutation({
    mutationFn: async (requestId) => {
      const { data } = await instance.patch(`/restock/${requestId}/cancel`);
      return data?.data;
    },
    onSuccess: () => {
      showSuccess("Restock request cancelled.");
      queryClient.invalidateQueries(["restock-requests", pharmacyId]);
    },
    onError: (error) => {
      showError(error, "Failed to cancel restock request");
    },
  });

  return {
    restockRequestsQuery,
    agentsQuery,
    createRestockRequest,
    cancelRestockRequest,
  };
};

/**
 * Hook for Delivery Agent side:
 *   - fetch pending restock supply requests assigned to this agent
 *   - fulfill a request (adds stock to pharmacy automatically)
 */
export const useAgentRestock = (agentId) => {
  const queryClient = useQueryClient();

  // Agent's pending supply requests
  const agentRestockQuery = useQuery({
    queryKey: ["agent-restock-requests", agentId],
    queryFn: async () => {
      const { data } = await instance.get(`/restock/agent?agent_id=${agentId}`);
      return data?.data || [];
    },
    enabled: !!agentId,
    refetchInterval: 30000, // auto-refresh every 30s
  });

  // Fulfill a restock request (adds stock to pharmacy)
  const fulfillRequest = useMutation({
    mutationFn: async (requestId) => {
      const { data } = await instance.patch(`/restock/${requestId}/fulfill`);
      return data?.data;
    },
    onSuccess: (data) => {
      showSuccess(
        `Fulfilled! Stock added to pharmacy (Batch: ${data.batchNo})`,
      );
      queryClient.invalidateQueries(["agent-restock-requests", agentId]);
    },
    onError: (error) => {
      showError(error, "Failed to fulfill restock request");
    },
  });

  return {
    agentRestockQuery,
    fulfillRequest,
  };
};
