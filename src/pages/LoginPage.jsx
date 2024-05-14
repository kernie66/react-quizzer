import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import { useApi } from "../contexts/ApiProvider";
import { Trans, useTranslation } from "react-i18next";
import isValidEmail from "../helpers/isValidEmail";
import { trim } from "radash";
import { useErrorBoundary } from "react-error-boundary";
import { useDisclosure } from "@mantine/hooks";
import { Button, Divider, Group, Modal, PasswordInput, Text, TextInput, rem } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { TbCheck, TbX } from "react-icons/tb";
import { useState } from "react";

export default function LoginPage() {
  const [opened, { open, close }] = useDisclosure(true);
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const api = useApi();
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const location = useLocation();
  const { showBoundary } = useErrorBoundary();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: isNotEmpty(t("username-or-email-is-missing")),
      password: isNotEmpty(t("password-is-missing")),
    },
  });

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const formValues = form.getValues();
      const username = trim(formValues.username.toLowerCase());
      form.setValues({ username: username });
      const password = formValues.password;

      const errors = {};
      const userCheck = {};
      if (!username) {
        errors.username = t("username-or-email-is-missing");
      } else {
        if (isValidEmail(username)) {
          userCheck.email = username;
        } else {
          userCheck.username = username;
        }
        try {
          const existingUser = await api.get("/check", userCheck);
          if (existingUser.status === 200) {
            console.log("existingUser", existingUser);
            console.log("User exists");
          } else {
            throw new Error("Server error", existingUser);
          }
        } catch (error) {
          if (error.response.status === 404) {
            errors.username = t("user-not-found");
          } else {
            throw new Error("Error checking username", error);
          }
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
          icon: <TbCheck style={{ width: rem(18), height: rem(18) }} />,
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
              icon: <TbX style={{ width: rem(18), height: rem(18) }} />,
              autoClose: 5000,
            });
          }
          open();
        } else {
          let next = "/";
          // if (location.state && location.state.next) {
          //   next = location.state.next;
          // }
          navigate(next);
        }
      }
      form.setErrors(errors);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showBoundary(error);
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} fullscreen="sm" title={t("login")} yOffset="6rem">
        <Divider mb={8} />
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            label={t("username-or-email-address")}
            {...form.getInputProps("username")}
            key={form.key("username")}
            autoComplete="username"
            withAsterisk
            mb="md"
            data-autofocus
          />
          <PasswordInput
            label={t("password")}
            {...form.getInputProps("password")}
            key={form.key("password")}
            autoComplete="current-password"
            withAsterisk
          />
          <Group justify="space-between" my={8} pb={8} pt={16}>
            <Button type="submit" loading={isLoading}>
              {t("login")}
            </Button>
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
    </>
  );
}
