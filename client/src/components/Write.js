import { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Media, Row } from "reactstrap";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";
import InputField from "./InputField";

export default function Write({ showPost }) {
  const [formErrors, setFormErrors] = useState();
  const textField = useRef();
  const api = useApi();
  const { user } = useUser();

  useEffect(() => {
    textField.current.focus();
  }, []);
  
  const onSubmit = async (ev) => {
    ev.preventDefault();
    const response = await api.post('/posts', {
      text: textField.current.value
    });
    if (response.ok) {
      showPost(response.body);
      textField.current.value = '';
    }
    else {
      if (response.body.errors) {
        setFormErrors(response.body.errors.json);
      }
    }
  }

  return(
    <Container className="Write">
      <Row className="border-bottom">
        <Col xs="1" className="Avatar64">
          <Media src={user.avatar_url + "&s=64"}
            className="rounded-circle mb-2" />
        </Col>
        <Col>
          <Form onSubmit={onSubmit}>
            <InputField 
              name="text" placeholder="What's on your mind?"
              errors={formErrors} fieldRef={textField} />
          </Form>
        </Col>
      </Row>
    </Container>
  );
}