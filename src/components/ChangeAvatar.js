import { useRef, useState } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import InputField from "./InputField";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import { useUser } from "../contexts/UserProvider";

export default function ChangeAvatar({ modal, closeModal }) {
  const [formErrors, setFormErrors] = useState({});
  const usernameField = useRef();
  const emailField = useRef();
  const aboutMeField = useRef();
  const api = useApi();
  const { user, setUser } = useUser();
  const flash = useFlash();

  const onOpened = () => {
    usernameField.current.value = user.username;
    emailField.current.value = user.email;
    aboutMeField.current.value = user.about_me;
    usernameField.current.focus();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const response = await api.put("/me", {
      username: usernameField.current.value,
      email: emailField.current.value,
      about_me: aboutMeField.current.value,
    });
    if (response.ok) {
      setFormErrors({});
      setUser(response.body);
      flash("Your profile has been updated.", "success", 5);
      closeModal();
    } else {
      setFormErrors(response.body.errors.json);
    }
  };

  return (
    <Modal isOpen={modal} onOpened={onOpened} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>Edit user information</ModalHeader>
      <ModalBody className="pt-0">
        <Form onSubmit={onSubmit}>
          <InputField
            label="Username"
            name="username"
            fieldRef={usernameField}
            error={formErrors.username}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            fieldRef={emailField}
            error={formErrors.email}
          />
          <InputField
            label="About me"
            name="About me"
            fieldRef={aboutMeField}
            error={formErrors.about_me}
          />
          <Button color="primary" type="submit">
            Update
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
}
