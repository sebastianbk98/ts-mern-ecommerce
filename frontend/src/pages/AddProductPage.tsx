import { ChangeEvent, FormEvent, useState } from "react";
import { Product } from "../types/Product";
import { Helmet } from "react-helmet-async";
import { Button, Form } from "react-bootstrap";
import FloatingLabelInput from "../components/FloatingLabelInput";
import { useAddProductMutation } from "../hooks/ProductHooks";
import LoadingBox from "../components/LoadingBox";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../types/ApiError";

function AddProductPage() {
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
  const [image, setImage] = useState<File | null>(null);
  const { mutateAsync: addProduct, isPending } = useAddProductMutation();
  const navigate = useNavigate();
  const onsubmitHandler = async (e: FormEvent) => {
    try {
      if (!image) {
        toast.error("Image is Empty");
        return;
      }
      e.preventDefault();
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("brand", product.brand);
      formData.append("price", product.price.toString());
      formData.append("category", product.category);
      formData.append("description", product.description);
      formData.append("countInStock", product.countInStock.toString());
      formData.append("rating", product.rating.toString());
      formData.append("numReviews", product.numReviews.toString());
      formData.append("image", image);
      const response = await addProduct(formData);
      if (response.product) {
        toast.success(response.message);
        navigate("/admin/products/");
        return;
      }
      toast.error(response.message);
      return;
    } catch (error) {
      toast.error((error as ApiError).message);
      return;
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Product</title>
      </Helmet>
      <h1 className="text-center">Add Product</h1>
      <Form onSubmit={onsubmitHandler} encType="multipart/form-data">
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
          label="image"
          // value={imageName}
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] || null;
            if (file) {
              setImage(file);
            }
          }}
          placeholder="Product Price"
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
        <FloatingLabelInput
          label="Rating"
          value={product.rating.toString()}
          type="number"
          onChange={(e) =>
            setProduct((prevState) => ({
              ...prevState,
              rating: Number((e.target as HTMLInputElement).value),
            }))
          }
          placeholder="Product Rating"
        />
        <FloatingLabelInput
          label="Reviews Count"
          value={product.numReviews.toString()}
          type="number"
          onChange={(e) =>
            setProduct((prevState) => ({
              ...prevState,
              numReviews: Number((e.target as HTMLInputElement).value),
            }))
          }
          placeholder="Product Reviews Count"
        />
        <div className="d-grid">
          <Button type="submit" disabled={isPending}>
            Add Product {isPending && <LoadingBox />}
          </Button>
        </div>
      </Form>
    </>
  );
}

export default AddProductPage;
