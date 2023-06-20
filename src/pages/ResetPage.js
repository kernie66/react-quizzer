import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form } from "reactstrap";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";

export default function ResetPage() {
  const [formErrors, setFormErrors] = useState({});
  const passwordField = useRef();
  const password2Field = useRef();
  const api = useApi();
  const flash = useFlash();
  const navigate = useNavigate();
  const { search } = useLocation();
  const token = new URLSearchParams(search).get('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
    else {
      passwordField.current.focus();
    }
  }, [token, navigate]);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (passwordField.current.value !== password2Field.current.value) {
      setFormErrors({
        password2: "New passwords don't match",
      });
    }
    else {
      const response = await api.put('/tokens/reset', {
        token,
        new_password: passwordField.current.value,
      });
      if (response.ok) {
        setFormErrors({});
        flash('Your password has been successfully reset', 'success');
        navigate('/login');
      }
      else {
        if (response.body.errors.json.new_password) {
          setFormErrors(response.body.errors.json);
        }
        else {
          flash('Password could not be reset. Please try again.', 'danger');
          navigate('/reset-request');
        }
      }
    }
  };

  return (
    <Body>
      <h1>Reset your password</h1>
      <Form onSubmit={onSubmit}>
        <InputField label="New password" name="password" type="password"
          fieldRef={passwordField} error={formErrors.password} />
        <InputField label="Repeat password" name="password" type="password"
          fieldRef={password2Field} error={formErrors.password2} />
        <Button color="primary" type="submit">Update</Button>
      </Form>
    </Body>
  );
}