import { useId } from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";

export default function InputField({
  label,
  name,
  type,
  autoComplete,
  placeholder,
  fieldRef,
  error,
  isValid,
  onChange,
  onBlur,
}) {
  const id = useId();

  const changeHandler = (ev) => {
    ev.preventDefault();
    if (onChange) {
      onChange(ev.target.value);
      console.log("On change:", ev.target.value, "Result:", onChange(ev.target.value));
    }
  };

  const blurHandler = (ev) => {
    ev.preventDefault();
    if (onBlur) {
      onBlur(ev.target.value);
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
        valid={isValid && isValid !== ""}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
      <FormFeedback valid>{isValid}</FormFeedback>
      <FormFeedback>{error}</FormFeedback>
    </FormGroup>
  );
}
