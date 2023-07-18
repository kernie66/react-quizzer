import { useId, useState } from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";

export default function InputField({
  label,
  name,
  type,
  autoComplete,
  placeholder,
  fieldRef,
  error,
  onChange,
  onBlur,
}) {
  const id = useId();
  const [isValid, setIsValid] = useState("");

  const changeHandler = (ev) => {
    ev.preventDefault();
    if (onChange) {
      setIsValid(onChange(ev.target.value));
      console.log("On change:", ev.target.value, "Result:", onChange(ev.target.value));
    }
  };

  const blurHandler = (ev) => {
    ev.preventDefault();
    if (onBlur) {
      setIsValid(onBlur(ev.target.value));
      console.log("On blur:", ev.target.value, "Result:", onBlur(ev.target.value));
    }
  };

  return (
    <FormGroup className="InputField">
      {label && <Label for={id}>{label}</Label>}
      <Input
        id={id}
        name={name}
        type={type || "text"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        innerRef={fieldRef}
        invalid={error !== undefined}
        valid={isValid !== undefined}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
      <FormFeedback valid>{isValid}</FormFeedback>
      <FormFeedback>{error}</FormFeedback>
    </FormGroup>
  );
}
