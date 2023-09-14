import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Modal, ModalBody, ModalHeader } from "reactstrap";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import SetPassword from "../components/SetPassword.js";
import { useTranslation } from "react-i18next";

export default function ChangePasswordPage() {
  const [modal, setModal] = useState(true);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordError, setPasswordError] = useState();
  const [password2Value, setPassword2Value] = useState("");
  const [password2Error, setPassword2Error] = useState();
  const [formErrors, setFormErrors] = useState({});
  const oldPasswordField = useRef();
  const newPasswordField = useRef();
  const newPassword2Field = useRef();
  const api = useApi();
  const flash = useFlash();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onOpened = () => {
    oldPasswordField.current.focus();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (newPasswordField.current.value !== newPassword2Field.current.value) {
      setFormErrors({ newPassword2: "New passwords don't match" });
    } else {
      const response = await api.put("/me", {
        old_password: oldPasswordField.current.value,
        password: newPasswordField.current.value,
      });
      if (response.ok) {
        setFormErrors({});
        setModal(false);
        flash("Your password has been updated", "success");
        navigate("/me");
      } else {
        setFormErrors(response.body.errors.json);
      }
    }
  };

  return (
    <Body sidebar>
      <Modal isOpen={modal} onOpened={onOpened} fullscreen="sm" className="mt-0">
        <Form onSubmit={onSubmit}>
          <ModalHeader className="py-2">{t("change-password")}</ModalHeader>
          <ModalBody className="pt-0">
            <FormGroup>
              <InputField
                label={t("old-password")}
                name="oldPassword"
                type="password"
                fieldRef={oldPasswordField}
                error={formErrors.old_password}
              />
              <hr />
              <SetPassword
                passwordValue={passwordValue}
                setPasswordValue={setPasswordValue}
                passwordError={passwordError}
                setPasswordError={setPasswordError}
                password2Value={password2Value}
                setPassword2Value={setPassword2Value}
                password2Error={password2Error}
                setPassword2Error={setPassword2Error}
                passwordField={newPasswordField}
                password2Field={newPassword2Field}
                passwordUserInputs={["Saab"]}
              />
              <Button color="primary" type="submit">
                Update
              </Button>
            </FormGroup>
          </ModalBody>
        </Form>
      </Modal>
    </Body>
  );
}
