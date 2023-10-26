import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const theme = extendTheme({
  colors: {
    cyan: {
      50: "#E0F7FA",
      100: "#B2EBF2",
      // Tambahkan nilai warna sesuai kebutuhan Anda
    },
    red: {
      50: "#FFEBEE",
      100: "#FFCDD2",
      // Tambahkan nilai warna sesuai kebutuhan Anda
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}
