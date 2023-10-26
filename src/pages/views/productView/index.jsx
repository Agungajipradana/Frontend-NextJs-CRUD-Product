import { useState, useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useFetchProducts, useCreateProduct, useEditProduct, useDeleteProduct } from "@/features/product";

const ProductView = () => {
  const [isClient, setIsClient] = useState(false);
  const toast = useToast();
  const { isOpen: isOpenDeleteButton, onOpen: onOpenDeleteButton, onClose: onCloseDeleteButton } = useDisclosure();
  const cancelRef = useRef();
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data,
    isLoading: productsIsLoading,
    refetch: refetchProducts,
  } = useFetchProducts({
    onError: () => {
      toast({
        title: "Ada kesalahan terjadi",
        status: "error",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      image: "",
    },
    onSubmit: async () => {
      const { name, price, description, image, id } = formik.values;

      if (id) {
        // Melakukan PATCH /products/{id}
        editProduct({
          name,
          price: parseInt(price),
          description,
          image,
          id,
        });
        toast({
          title: "product  edited",
          status: "Succees",
        });
      } else {
        // Melakukan POST /products
        createProduct({
          name,
          price: parseInt(price),
          description,
          image,
        });
        toast({
          title: "product  added",
          status: "Succees",
        });
      }

      // Mereset form ketika selesai di input
      formik.setFieldValue("name", "");
      formik.setFieldValue("price", 0);
      formik.setFieldValue("description", "");
      formik.setFieldValue("image", "");
      formik.setFieldValue("id", 0);
    },
  });

  const { mutate: createProduct, isLoading: createProductsIsLoading } = useCreateProduct({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const { mutate: editProduct, isLoading: editProductIsLoading } = useEditProduct({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const handleFormInput = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      // console.log("Deleting product with ID:", productToDelete);
      deleteProduct(productToDelete);
      toast({
        title: "Delete Product",
        status: "info",
      });
    }
    onCloseDeleteButton();
  };

  const AlertDialogButtonDelete = (productId) => {
    // Saat tombol "Delete" diklik, set ID produk yang akan dihapus ke dalam state
    setProductToDelete(productId);
    onOpenDeleteButton();
  };

  const onEditClick = (product) => {
    formik.setFieldValue("id", product.id);
    formik.setFieldValue("name", product.name);
    formik.setFieldValue("price", product.price);
    formik.setFieldValue("description", product.description);
    formik.setFieldValue("image", product.image);
  };

  const renderProducts = () => {
    return data?.data.map((product) => {
      return (
        <Tr key={product.id}>
          <Td>{product.id}</Td>
          <Td>{product.name}</Td>
          <Td>Rp. {product.price.toLocaleString("id-ID", { styles: "currency", currency: "IDR", minimumFractionDigits: 0 })}</Td>
          <Td>{product.description.length > 25 ? product.description.substring(0, 25) + "..." : product.description}</Td>
          <Td>{product.image.length > 20 ? product.image.substring(0, 20) + "..." : product.image}</Td>
          <Td>
            <Button onClick={() => onEditClick(product)} colorScheme={"cyan"} color={"white"} marginRight={2}>
              Edit{" "}
            </Button>
            <Button onClick={() => AlertDialogButtonDelete(product.id)} colorScheme={"red"}>
              Delete{" "}
            </Button>
          </Td>
        </Tr>
      );
    });
  };
  return (
    <Box bg="gray.800" color="white">
      <Heading marginBottom={10} paddingTop={5}>
        Dashboard Admin{" "}
      </Heading>
      {isClient ? (
        <TableContainer>
          <Table mb="6">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Price</Th>
                <Th>Description</Th>
                <Th>Image</Th>
                <Th colSpan={2}>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {renderProducts()}
              {productsIsLoading ? <Spinner /> : null}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        "Prerendered"
      )}

      <form onSubmit={formik.handleSubmit}>
        <VStack spacing="3">
          <FormControl>
            <FormLabel>Product ID</FormLabel>
            <Input onChange={handleFormInput} name="id" value={formik.values.id} disabled />
          </FormControl>
          <FormControl>
            <FormLabel>Product Name</FormLabel>
            <Input onChange={handleFormInput} name="name" value={formik.values.name} />
          </FormControl>
          <FormControl>
            <FormLabel>Price</FormLabel>
            <Input onChange={handleFormInput} name="price" value={formik.values.price} />
          </FormControl>
          <FormControl>
            <FormLabel>Descritption</FormLabel>
            <Input onChange={handleFormInput} name="description" value={formik.values.description} />
          </FormControl>
          <FormControl>
            <FormLabel>Image</FormLabel>
            <Input onChange={handleFormInput} name="image" value={formik.values.image} />
          </FormControl>
          {createProductsIsLoading || editProductIsLoading ? <Spinner /> : <Button type="submit">Submit Product</Button>}
        </VStack>
      </form>
      {/* AlertDialog Delete Button */}
      <AlertDialog isOpen={isOpenDeleteButton} leastDestructiveRef={cancelRef} onClose={onCloseDeleteButton}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure you want to delete this product?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDeleteButton}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteProduct} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProductView;
