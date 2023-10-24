import { Link, useLocation, useNavigate } from "react-router-dom";
import Body from "../components/Body";
import { useUser } from "../contexts/UserProvider";
import { useApi } from "../contexts/ApiProvider.js";
import { Trans, useTranslation } from "react-i18next";
import isValidEmail from "../helpers/isValidEmail.js";
import { trim } from "radash";
import { useErrorBoundary } from "react-error-boundary";
import { useDisclosure } from "@mantine/hooks";
import { Button, Divider, Group, Modal, PasswordInput, Text, TextInput, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export default function LoginPage() {
  const [opened, { open, close }] = useDisclosure(true);
  const { login } = useUser();
  const api = useApi();
  const { t } = useTranslation();
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
        showNotification({
          title: t("login"),
          message: t("logging-in-username", { username }),
          color: "green",
          icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
          autoClose: 5000,
        });
        const result = await login(username, password);
        console.log("Login result:", result);
        if (!result.ok) {
          if (result.status === 401) {
            errors.password = t("invalid-password");
          } else {
            showNotification({
              title: t("login"),
              message: t("server-error-when-logging-in"),
              color: "red",
              icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
              autoClose: 5000,
            });
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
      <Modal opened={opened} onClose={close} fullscreen="sm" title={t("login")} yOffset="6rem">
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
            autoComplete="current-password"
            withAsterisk
          />
          <Group justify="space-between" my={8} pb={8} pt={16}>
            <Button type="submit">{t("login")}</Button>
            <Button variant="outline" onClick={close}>
              {t("cancel")}
            </Button>
          </Group>
          <Divider mb={8} />
          <Text c="dimmed">
            {t("dont-have-an-account")} <Link to="/register">{t("register-here")}</Link>
          </Text>
          <Text c="dimmed">
            <Trans i18nKey="forgot-password">
              Forgot your password? Request a <Link to="/reset-request">new password here</Link>.
            </Trans>
          </Text>
        </form>
      </Modal>
    </Body>
  );
}
