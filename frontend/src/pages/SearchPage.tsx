import { useLocation } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import { ApiError } from "../types/ApiError";
import { useGetProductDetailsBySearchTermQuery } from "../hooks/ProductHooks";
import { getError } from "../utils";
import ProductItem from "../components/ProductItem";
import { Product } from "../types/Product";
import PaginationComponent from "../components/PaginationComponent";
import LoadingBox from "../components/LoadingBox";
import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

function SearchPage() {
  const location = useLocation();
  const keyword = decodeURIComponent(
    new URLSearchParams(location.search).get("keyword") ?? ""
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { data, isLoading, error } = useGetProductDetailsBySearchTermQuery(
    keyword,
    Number(pageNumber)
  );
  useEffect(() => {
    setPageNumber(1);
  }, [keyword]);
  const onPaginationClick = (page: number) => setPageNumber(page);
  return (
    <Container>
      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
      ) : data!.products.length === 0 ? (
        <MessageBox>No products found</MessageBox>
      ) : (
        <>
          <Row className="justify-content-space-between g-3 p-5">
            {data!.products.map((product: Product) => (
              <Col key={product._id} sm={6} md={4} lg={3}>
                <ProductItem product={product} />
              </Col>
            ))}
          </Row>
          <PaginationComponent
            className="d-flex justify-content-center"
            page={data!.page}
            pages={data!.pages}
            onPaginationClick={onPaginationClick}
          />
        </>
      )}
    </Container>
  );
}

export default SearchPage;
