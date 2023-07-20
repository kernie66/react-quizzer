import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import Body from "../components/Body";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import { useTranslation } from "react-i18next";
import getNameFromEmail from "../helpers/getNameFromEmail.js";
import SetUsername from "../components/SetUsername.js";
import SetEmailAddress from "../components/SetEmailAddress.js";
import { sift } from "radash";
import SetPassword from "../components/SetPassword.js";

export default function RegistrationPage() {
  const [modal, setModal] = useState(true);
  const [usernameValue, setUsernameValue] = useState();
  const [usernameError, setUsernameError] = useState();
  const [emailAddressValue, setEmailAddressValue] = useState();
  const [emailAddressError, setEmailAddressError] = useState();
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordError, setPasswordError] = useState();
  const [password2Value, setPassword2Value] = useState("");
  const [password2Error, setPassword2Error] = useState();
  const usernameField = useRef();
  const emailField = useRef();
  const passwordField = useRef();
  const password2Field = useRef();
  const navigate = useNavigate();
  const api = useApi();
  const flash = useFlash();
  const { t } = useTranslation();

  const onOpened = () => {
    usernameField.current.focus();
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const currentErrors = [usernameError, emailAddressError, passwordError, password2Error];
    console.log("Sift:", sift(currentErrors), currentErrors);
    let errors = sift(currentErrors).length !== 0;
    console.log("Errors:", errors);
    if (!usernameValue) {
      setUsernameError(t("please-select-a-username"));
      errors = true;
    }
    if (!emailAddressValue) {
      setEmailAddressError(t("please-enter-a-valid-email-address"));
      errors = true;
    }
    if (!passwordValue) {
      setPasswordError(t("please-select-a-password"));
    }
    if (!password2Value) {
      setPassword2Error(t("please-repeat-the-password"));
    }

    if (errors) {
      return;
    }

    const name = getNameFromEmail(emailAddressValue);
    const data = await api.register({
      username: usernameValue,
      name: name,
      email: emailAddressValue,
      password: passwordValue,
    });
    if (data.ok) {
      setModal(false);
      flash(t("you-have-successfully-registered"), "success");
      navigate("/login");
    }
  };

  const cancel = () => {
    navigate("/login");
  };

  return (
    <Body>
      <Modal isOpen={modal} onOpened={onOpened} className="mt-0">
        <ModalHeader className="py-2">{t("user-registration")}</ModalHeader>
        <ModalBody className="pt-0">
          <Form onSubmit={onSubmit}>
            <SetUsername
              usernameValue={usernameValue}
              setUsernameValue={setUsernameValue}
              usernameError={usernameError}
              setUsernameError={setUsernameError}
              usernameField={usernameField}
            />
            <SetEmailAddress
              emailAddressValue={emailAddressValue}
              setEmailAddressValue={setEmailAddressValue}
              emailAddressError={emailAddressError}
              setEmailAddressError={setEmailAddressError}
              emailAddressField={emailField}
            />
            <SetPassword
              passwordValue={passwordValue}
              setPasswordValue={setPasswordValue}
              passwordError={passwordError}
              setPasswordError={setPasswordError}
              password2Value={password2Value}
              setPassword2Value={setPassword2Value}
              password2Error={password2Error}
              setPassword2Error={setPassword2Error}
              passwordField={passwordField}
              password2Field={password2Field}
              passwordUserInputs={[usernameValue, emailAddressValue, "Saab"]}
            />
            <Row className="justify-content-between mb-2">
              <Col>
                <Button color="primary" className="submit me-auto">
                  {t("register")}
                </Button>
              </Col>
              <Col>
                <Button color="secondary" onClick={cancel} className="float-end">
                  {t("cancel")}
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Body>
  );
}
