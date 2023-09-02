import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Modal, ModalBody, ModalHeader } from "reactstrap";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { useFlash } from "../contexts/FlashProvider";
import { useUser } from "../contexts/UserProvider";
import { useApi } from "../contexts/ApiProvider.js";
import { Trans, useTranslation } from "react-i18next";
import isValidEmail from "../helpers/isValidEmail.js";
import { trim } from "radash";
import { useErrorBoundary } from "react-error-boundary";

export default function LoginPage() {
  const [formErrors, setFormErrors] = useState({});
  const [modal, setModal] = useState(true);
  const usernameField = useRef();
  const passwordField = useRef();
  const { login } = useUser();
  const api = useApi();
  const { t } = useTranslation();
  const flash = useFlash();
  const navigate = useNavigate();
  const location = useLocation();
  const { showBoundary } = useErrorBoundary();

  const onOpened = () => {
    usernameField.current.focus();
  };

  const onSubmit = async (ev) => {
    try {
      ev.preventDefault();
      const username = trim(usernameField.current.value.toLowerCase());
      const password = passwordField.current.value;

      const errors = {};
      let userCheck = {};
      if (!username) {
        errors.username = t("username-or-email-is-missing");
      } else {
        if (isValidEmail(username)) {
          userCheck.email = username;
        } else {
          userCheck.username = username;
        }
        const existingUser = await api.get("/check", userCheck);
        if (existingUser.status !== 200) {
          errors.username = t("user-not-found");
        }
      }
      if (!password) {
        errors.password = t("password-is-missing");
      }
      if (Object.keys(errors).length === 0) {
        setModal(false);
        flash(t("logging-in-username", { username }), "info", 2);
        const result = await login(username, password);
        console.log("Login result:", result);
        if (!result.ok) {
          if (result.status === 401) {
            errors.password = t("invalid-password");
          } else {
            flash(t("server-error-when-logging-in"), "danger");
          }
          setModal(true);
        } else {
          let next = "/";
          if (location.state && location.state.next) {
            next = location.state.next;
          }
          navigate(next);
        }
      }
      setFormErrors(errors);
    } catch (error) {
      showBoundary(error);
    }
  };

  return (
    <Body>
      <Modal isOpen={modal} onOpened={onOpened} className="mt-0">
        <Form onSubmit={onSubmit}>
          <ModalHeader>{t("login")}</ModalHeader>
          <ModalBody className="pt-0">
            <FormGroup>
              <InputField
                label={t("username-or-email-address")}
                name="username"
                autoComplete="username"
                fieldRef={usernameField}
                error={formErrors.username}
              />
              <InputField
                label={t("password")}
                name="password"
                autoComplete="current-password"
                type="password"
                fieldRef={passwordField}
                error={formErrors.password}
              />
              <Button color="primary" className="mb-2">
                {t("login")}
              </Button>
              <hr />
              <p>
                {t("dont-have-an-account")} <Link to="/register">{t("register-here")}</Link>
              </p>
              <p>
                <Trans i18nKey="forgot-password">
                  Forgot your password? Request a <Link to="/reset-request">new password here</Link>
                  .
                </Trans>
              </p>
            </FormGroup>
          </ModalBody>
        </Form>
      </Modal>
    </Body>
  );
}
