import { useRef, useState } from "react";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import Body from "../components/Body";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ResetRequestPage() {
  const [formErrors, setFormErrors] = useState({});
  const [modal, setModal] = useState(true);
  const emailField = useRef();
  const api = useApi();
  const flash = useFlash();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  let language = "en";

  const onOpened = () => {
    const languageCode = i18n.resolvedLanguage;
    language = languageCode.split("-")[0];
    emailField.current.focus();
    console.log(window.location.href, language);
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const response = await api.post("/tokens/reset", {
      email: emailField.current.value,
    });
    if (!response.ok) {
      setFormErrors(response.body.errors.json);
    } else {
      emailField.current.value = "";
      setFormErrors({});
      setModal(false);
      flash("You will receive an email with instructions " + "to reset your password", "info");
    }
  };

  const cancelRequest = () => {
    navigate("/");
  };

  return (
    <Body>
      <Modal isOpen={modal} onOpened={onOpened} toggle={cancelRequest} fullscreen="sm">
        <ModalHeader toggle={cancelRequest}>Request password reset</ModalHeader>
        <ModalBody className="pt-0">
          <Form onSubmit={onSubmit}>
            <InputField
              label="Email"
              name="email"
              type="email"
              fieldRef={emailField}
              error={formErrors.email}
            />
            <Button color="primary" type="submit">
              Reset password
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </Body>
  );
}
