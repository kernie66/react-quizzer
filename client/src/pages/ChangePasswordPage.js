import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "reactstrap";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";

export default function ChangePasswordPage() {
  const [formErrors, setFormErrors] = useState({});
  const oldPasswordField = useRef();
  const newPasswordField = useRef();
  const newPasswordField2 = useRef();
  const api = useApi();
  const flash = useFlash();
  const navigate = useNavigate();

  useEffect(() => {
    oldPasswordField.current.focus();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (newPasswordField.current.value !== newPasswordField2.current.value) {
      setFormErrors({newPassword2: "New passwords don't match"});
    }
    else {
      const response = await api.put('/me', {
        old_password: oldPasswordField.current.value,
        password: newPasswordField.current.value,
      });
      if (response.ok) {
        setFormErrors({});
        flash('Your password has been updated', 'success');
        navigate('/me');
      }
      else {
        setFormErrors(response.body.errors.json);
      }
    }
  };

  return(
    <Body sidebar>
      <h1>Change password</h1>
      <Form onSubmit={onSubmit}>
        <InputField label="Old password" name="oldPassword" type="password"
                    fieldRef={oldPasswordField} error={formErrors.old_password} />
        <InputField label="New password" name="newPassword" type="password"
                    fieldRef={newPasswordField} error={formErrors.password} />
        <InputField label="Repeat password" name="newPassword2" type="password"
                    fieldRef={newPasswordField2} error={formErrors.password2} />
        <Button color="primary" type="submit">Update</Button>
      </Form>
    </Body>
  );
}