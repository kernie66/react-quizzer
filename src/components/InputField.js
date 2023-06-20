import { useId } from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";

export default function InputField({
  label,
  name,
  type,
  autocomplete,
  placeholder,
  fieldRef,
  error,
}) {
  const id = useId();

  return (
    <FormGroup className="InputField">
      {label && <Label for={id}>{label}</Label>}
      <Input
        id={id}
        name={name}
        type={type || "text"}
        autoComplete={autocomplete}
        placeholder={placeholder}
        innerRef={fieldRef}
        invalid={error !== undefined}
      />
      <FormFeedback invalid>{error}</FormFeedback>
    </FormGroup>
  );
}
