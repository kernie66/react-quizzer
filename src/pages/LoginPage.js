import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Button, Form, FormGroup, Modal, ModalBody, ModalHeader } from "reactstrap";
import Body from "../components/Body";
import { useFlash } from "../contexts/FlashProvider";
import { useUser } from "../contexts/UserProvider";
import { useApi } from "../contexts/ApiProvider.js";
import { Trans, useTranslation } from "react-i18next";
import isValidEmail from "../helpers/isValidEmail.js";
import { trim } from "radash";
import { useErrorBoundary } from "react-error-boundary";
import { useDisclosure } from "@mantine/hooks";
import { Button, Divider, Group, Modal, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function LoginPage() {
  const [opened, { open, close }] = useDisclosure(true);
  const { login } = useUser();
  const api = useApi();
  const { t } = useTranslation();
  const flash = useFlash();
  const navigate = useNavigate();
  const location = useLocation();
  const { showBoundary } = useErrorBoundary();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    try {
      const username = trim(form.values.username.toLowerCase());
      const password = form.values.password;

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
        close();
        flash(t("logging-in-username", { username }), "info", 2);
        const result = await login(username, password);
        console.log("Login result:", result);
        if (!result.ok) {
          if (result.status === 401) {
            errors.password = t("invalid-password");
          } else {
            flash(t("server-error-when-logging-in"), "danger");
          }
          open();
        } else {
          let next = "/";
          if (location.state && location.state.next) {
            next = location.state.next;
          }
          navigate(next);
        }
      }
      form.setErrors(errors);
    } catch (error) {
      showBoundary(error);
    }
  };

  return (
    <Body>
      <Modal opened={opened} onClose={close} fullscreen="sm" title={<h5>{t("login")}</h5>}>
        <Divider mb={8} />
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            label={t("username-or-email-address")}
            {...form.getInputProps("username")}
            autoComplete="username"
            withAsterisk
            mb="md"
            data-autofocus
          />
          <PasswordInput
            label={t("password")}
            {...form.getInputProps("password")}
            name="password"
            autoComplete="current-password"
          />
          <Group justify="space-between" my={8} pt={16}>
            <Button type="submit">{t("login")}</Button>
            <Button variant="outline" onClick={close}>
              {t("cancel")}
            </Button>
          </Group>

          <hr />
          <p>
            {t("dont-have-an-account")} <Link to="/register">{t("register-here")}</Link>
          </p>
          <p>
            <Trans i18nKey="forgot-password">
              Forgot your password? Request a <Link to="/reset-request">new password here</Link>.
            </Trans>
          </p>
        </form>
      </Modal>
    </Body>
  );
}
