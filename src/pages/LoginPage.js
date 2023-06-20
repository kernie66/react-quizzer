import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { useFlash } from "../contexts/FlashProvider";
import { useUser } from "../contexts/UserProvider";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const [formErrors, setFormErrors] = useState({});
  const [modal, setModal] = useState(true);
  const usernameField = useRef();
  const passwordField = useRef();
  const { login } = useUser();
  const { t } = useTranslation();
  const flash = useFlash();
  const navigate = useNavigate();
  const location = useLocation();
  /*
    useEffect(() => {
      usernameField.current.focus();
    }, []);
  */
  const onOpened = () => {
    usernameField.current.focus();
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const username = usernameField.current.value;
    const password = passwordField.current.value;

    const errors = {};
    if (!username) {
      errors.username = t("username-or-email-is-missing");
    }
    if (!password) {
      errors.password = t("password-is-missing");
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setModal(false);
    flash(t("logging-in-username", { username }), "info", 2);
    const result = await login(username, password);
    if (!result.ok) {
      if (result.status === 401) {
        flash(t("invalid-username-or-password"), "danger");
        setModal(true);
      } else {
        flash(t("server-error-when-logging-in"), "danger");
      }
    } else {
      let next = "/";
      if (location.state && location.state.next) {
        next = location.state.next;
      }
      navigate(next);
    }
  };

  return (
    <Body>
      <Modal isOpen={modal} onOpened={onOpened}>
        <ModalHeader>{t("login")}</ModalHeader>
        <ModalBody className="pt-0">
          <Form onSubmit={onSubmit}>
            <InputField
              label={t("username-or-email-address")}
              name="username"
              autocomplete="username"
              fieldRef={usernameField}
              error={formErrors.username}
            />
            <InputField
              label={t("password")}
              name="password"
              autocomplete="current-password"
              type="password"
              fieldRef={passwordField}
              error={formErrors.password}
            />
            <Button color="primary" type="submit" className="mb-2">
              {t("login")}
            </Button>
          </Form>
          <hr />
          <p>
            {t("dont-have-an-account")} <Link to="/register">{t("register-here")}</Link>
          </p>
          <p>
            Forgot your password? Request a <Link to="/reset-request">new password here</Link>.
          </p>
        </ModalBody>
      </Modal>
    </Body>
  );
}
