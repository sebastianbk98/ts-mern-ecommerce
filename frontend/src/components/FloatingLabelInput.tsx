import { ChangeEvent } from "react";
import { Form } from "react-bootstrap";

interface Props {
  label: string;
  type: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  value?: string;
}

function FloatingLabelInput({
  label,
  type,
  onChange,
  placeholder,
  value = "",
}: Props) {
  return (
    <Form.FloatingLabel
      controlId="floatingInput"
      label={label}
      className="mb-3"
    >
      {value ? (
        <Form.Control
          type={type}
          onChange={onChange}
          required
          placeholder={placeholder}
          autoComplete="off"
          value={value}
        />
      ) : (
        <Form.Control
          type={type}
          onChange={onChange}
          required
          placeholder={placeholder}
          autoComplete="off"
        />
      )}
    </Form.FloatingLabel>
  );
}

export default FloatingLabelInput;
