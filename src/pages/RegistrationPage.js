import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Row } from "reactstrap";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider"
import { useFlash } from "../contexts/FlashProvider";

export default function RegistrationPage() {
  const [formErrors, setFormErrors] = useState({});
  const usernameField = useRef();
  const emailField = useRef();
  const passwordField = useRef();
  const password2Field = useRef();
  const navigate = useNavigate();
  const api = useApi();
  const flash = useFlash();

  useEffect(() => {
    usernameField.current.focus();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const username = usernameField.current.value;
    const email = emailField.current.value;
    const password = passwordField.current.value;
    const password2 = password2Field.current.value;

    const errors = {};
    if (!username) {
      errors.username = 'Please select a username';
    }
    if (!email) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) {
      errors.password = 'Please select a password';
    }
    if (!password2) {
      errors.password2 = 'Please repeat the password';
    }
    else {
      if (password !== password2) {
        errors.password2 = "The passwords doesn't match";
      }
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const data = await api.post('/users', {
      username: username,
      email: email,
      password: password,
    });
    if (!data.ok) {
      setFormErrors(data.body.errors.json)
    }
    else {
      setFormErrors({});
      flash('You have successfully registered!', 'success');
      navigate('/login');
    }
  };

  const cancel = () => {
    navigate('/login');
  };

  return (
    <Body>
      <Row className="justify-content-center">
        <Col xs="12" md="8" lg="7" xl="6">
          <h1>User Registration</h1>
          <Form onSubmit={onSubmit}>
            <InputField label="Username" name="username"
              fieldRef={usernameField} error={formErrors.username} />
            <InputField label="Email address" name="username" type="email"
              fieldRef={emailField} error={formErrors.email} />
            <InputField label="Password" name="password" type="password"
              fieldRef={passwordField} error={formErrors.password} />
            <InputField label="Repeat password" name="password2" type="password"
              fieldRef={password2Field} error={formErrors.password2} />
            <Row className="justify-content-between mb-2">
              <Col>
              <Button color="primary" className="submit me-auto">Register</Button>
              </Col>
              <Col>
              <Button color="secondary" onClick={cancel} className="float-end">Cancel</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Body>
  );
}