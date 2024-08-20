import { useNavigate, useParams } from "react-router-dom";
import {
  useEditProductMutation,
  useGetProductDetailsBySlugQuery,
} from "../hooks/ProductHooks";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { Button, Form } from "react-bootstrap";
import { FormEvent, useEffect, useState } from "react";
import { Product } from "../types/Product";
import FloatingLabelInput from "../components/FloatingLabelInput";
import { toast } from "react-toastify";

function EditProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetProductDetailsBySlugQuery(slug!);
  const [product, setProduct] = useState<Product>({
    _id: "",
    name: "",
    slug: "",
    brand: "",
    category: "",
    countInStock: 0,
    description: "",
    image: "",
    numReviews: 0,
    price: 0,
    rating: 0,
  });
  const { mutateAsync: editProduct, isPending } = useEditProductMutation();

  useEffect(() => {
    if (data) {
      setProduct(data);
    }
  }, [data]);
  const onsubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const response = await editProduct(product);
    if (response.product) {
      toast(response.message);
      navigate(`/admin/products/${response.product.slug}`);
      return;
    }
    toast.error(response.message);
    return;
  };
  return (
    <>
      <Helmet>
        <title>Product Details</title>
      </Helmet>
      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
      ) : !product ? (
        <MessageBox variant="danger">Product Not Found</MessageBox>
      ) : (
        <>
          <Helmet>
            <title>Edit Product</title>
          </Helmet>
          <h1>Edit Product</h1>
          <Form onSubmit={onsubmitHandler}>
            <FloatingLabelInput
              label="name"
              value={product.name}
              type="text"
              onChange={(e) =>
                setProduct((prevState) => ({
                  ...prevState,
                  name: (e.target as HTMLInputElement).value,
                }))
              }
              placeholder="Product Name"
            />
            <FloatingLabelInput
              label="price"
              value={product.price.toString()}
              type="number"
              onChange={(e) =>
                setProduct((prevState) => ({
                  ...prevState,
                  price: Number((e.target as HTMLInputElement).value),
                }))
              }
              placeholder="Product Price"
            />
            <FloatingLabelInput
              label="brand"
              value={product.brand}
              type="text"
              onChange={(e) =>
                setProduct((prevState) => ({
                  ...prevState,
                  brand: (e.target as HTMLInputElement).value,
                }))
              }
              placeholder="Product Brand"
            />
            <FloatingLabelInput
              label="description"
              value={product.description}
              type="text"
              onChange={(e) =>
                setProduct((prevState) => ({
                  ...prevState,
                  description: (e.target as HTMLInputElement).value,
                }))
              }
              placeholder="Product Description"
            />
            <FloatingLabelInput
              label="category"
              value={product.category}
              type="text"
              onChange={(e) =>
                setProduct((prevState) => ({
                  ...prevState,
                  category: (e.target as HTMLInputElement).value,
                }))
              }
              placeholder="Product Category"
            />
            <FloatingLabelInput
              label="countInStock"
              value={product.countInStock.toString()}
              type="number"
              onChange={(e) =>
                setProduct((prevState) => ({
                  ...prevState,
                  countInStock: Number((e.target as HTMLInputElement).value),
                }))
              }
              placeholder="Product Stock"
            />
            <div className="d-grid">
              <Button type="submit" disabled={isPending}>
                Edit Product {isPending && <LoadingBox />}
              </Button>
            </div>
          </Form>
        </>
      )}
    </>
  );
}

export default EditProductPage;
