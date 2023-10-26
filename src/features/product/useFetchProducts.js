import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useFetchProducts = ({ onError }) => {
  return useQuery({
    queryFn: async () => {
      const productResponse = await axiosInstance.get("/products");

      return productResponse;
    },
    queryKey: ["fetch.products"],
    onError,
  });
};
