import { useState } from "react";
import { Form, FormControl, Button, InputGroup } from "react-bootstrap";

interface SearchBoxProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(encodeURIComponent(searchTerm));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <FormControl
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search products"
        />
        <Button type="submit" variant="secondary">
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;
