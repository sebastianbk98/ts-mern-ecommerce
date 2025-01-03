import { Pagination } from "react-bootstrap";

interface PaginationProps {
  page: number;
  pages: number;
  className?: string;
  onPaginationClick: (page: number) => void;
}

const PaginationComponent = ({
  page,
  pages,
  className,
  onPaginationClick,
}: PaginationProps) => {
  const items = [];
  for (let pageNumber = 1; pageNumber <= pages; pageNumber++) {
    items.push(
      <Pagination.Item
        key={pageNumber}
        active={pageNumber === page}
        onClick={() => onPaginationClick(pageNumber)}
      >
        {pageNumber}
      </Pagination.Item>
    );
  }

  return <Pagination className={className}>{items}</Pagination>;
};

export default PaginationComponent;
