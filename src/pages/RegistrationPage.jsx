import { useNavigate } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import { useTranslation } from "react-i18next";
import getNameFromEmail from "../helpers/getNameFromEmail";
import SetUsername from "../components/SetUsername";
import SetEmailAddress from "../components/SetEmailAddress";
import SetPassword from "../components/SetPassword";
import { sift } from "radash";
import { useErrorBoundary } from "react-error-boundary";
import { Button, Divider, Group, Modal, rem } from "@mantine/core";
import { hasLength, matchesField, useForm } from "@mantine/form";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { TbCheck, TbX } from "react-icons/tb";
import isValidEmail from "../helpers/isValidEmail";
import isInvalidUsername from "../helpers/isInvalidUsername";
import { useState } from "react";

export default function RegistrationPage() {
  const [opened, { close }] = useDisclosure(true);
  const navigate = useNavigate();
  const api = useApi();
  const { t } = useTranslation();
  const { showBoundary } = useErrorBoundary();
  const isMobile = useMediaQuery("(max-width: 50em)");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const form = useForm({
    name: "registration-form",
    mode: "uncontrolled",
    initialValues: {
      username: "",
      email: "",
      password: "",
      password2: "",
    },
    onValuesChange: (values) => {
      setPassword(values.password);
      setNewEmail(values.email);
      setNewUsername(values.username);
    },
    validate: {
      username: (value) => (isInvalidUsername(value) ? t("please-select-a-username") : null),
      email: (value) => (!isValidEmail(value) ? t("please-enter-a-valid-email-address") : null),
      password: hasLength({ min: 5 }, t("please-select-a-password")),
      password2: matchesField("password", t("please-repeat-the-password")),
    },
  });

  const onSubmit = async () => {
    try {
      const currentErrors = [];
      console.log("Sift:", sift(currentErrors), currentErrors);
      let errors = sift(currentErrors).length !== 0;
      console.log("Errors:", errors);

      if (errors) {
        return;
      }

      const formValues = form.getValues();
      const name = getNameFromEmail(formValues.email);
      const data = await api.register({
        username: formValues.username,
        name: name,
        email: formValues.email,
        password: formValues.password,
      });
      if (data.ok) {
        close();
        showNotification({
          title: t("user-registration"),
          message: t("you-have-successfully-registered"),
          color: "green",
          icon: <TbCheck style={{ width: rem(18), height: rem(18) }} />,
          autoClose: 5000,
        });
        navigate("/login");
      } else {
        showNotification({
          title: t("user-registration"),
          message: t("registration-of-new-user-failed-on-server-please-try-again"),
          color: "red",
          icon: <TbX style={{ width: rem(18), height: rem(18) }} />,
          autoClose: 5000,
        });
      }
    } catch (error) {
      showBoundary(error);
    }
  };

  const cancel = () => {
    close();
    navigate("/login");
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        closeOnEscape={false}
        closeOnClickOutside={false}
        fullScreen={isMobile}
        size="lg"
        title={t("user-registration")}
        yOffset="6rem"
        mb="xs"
      >
        <Divider mb={8} />
        <form onSubmit={form.onSubmit(onSubmit)}>
          <SetUsername form={form} focus={true} newUsername={newUsername} />
          <SetEmailAddress form={form} newEmail={newEmail} />
          <SetPassword form={form} password={password} />
          <Divider mb={8} />
          <Group justify="space-between" my={8} pt={16}>
            <Button type="submit">{t("register")}</Button>
            <Button variant="outline" onClick={cancel}>
              {t("cancel")}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
