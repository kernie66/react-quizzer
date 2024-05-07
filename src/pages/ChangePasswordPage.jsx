import { useApi } from "../contexts/ApiProvider";
import SetPassword from "../components/SetPassword";
import { useTranslation } from "react-i18next";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Button, Divider, Group, Modal, PasswordInput, Text, rem } from "@mantine/core";
import { useUser } from "../contexts/UserProvider";
import { showNotification } from "@mantine/notifications";
import { TbCheck, TbX } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ChangePasswordPage() {
  const [opened, { close }] = useDisclosure(true);
  const api = useApi();
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 50em)");
  const { user } = useUser();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: user.username,
      email: user.email,
      name: user.name,
      oldPassword: "",
      password: "",
      password2: "",
    },
    onValuesChange: (values) => {
      setPassword(values.password);
    },
    validate: (values) => ({
      oldPassword: values.oldPassword.length === 0 ? t("please-enter-your-current-password") : null,
      password:
        values.password.length === 0
          ? t("please-select-a-password")
          : values.password === values.oldPassword
            ? t("please-enter-a-different-password-than-the-current")
            : null,
      password2: values.password2.length === 0 ? t("please-repeat-the-password") : null,
    }),
  });

  const onSubmit = async () => {
    const formValues = form.getValues();
    const response = await api.put(`/users/${user.id}/password`, {
      oldPassword: formValues.oldPassword,
      newPassword: formValues.password,
    });
    if (response.status === 201) {
      showNotification({
        title: t("change-password"),
        message: t("your-password-has-been-updated"),
        color: "green",
        icon: <TbCheck style={{ width: rem(18), height: rem(18) }} />,
        autoClose: 5000,
      });
      close();
      navigate(-1);
    } else if (response.status === 200) {
      console.log("Response:", response);
      switch (response.data.error) {
        case "Wrong password":
          form.setFieldError("oldPassword", t("invalid-password"));
          break;
        case "Password missing":
          form.setFieldError("oldPassword", t("please-enter-your-current-password"));
          break;
        case "User not found":
          form.setFieldError("oldPassword", t("user-not-found"));
          break;
        default:
          form.setFieldError("oldPassword", t("unknown-response-from-server"));
          break;
      }
    } else {
      console.log("Error");
      showNotification({
        title: t("change-password"),
        message: t("password-could-not-be-changed-please-try-again"),
        color: "red",
        icon: <TbX style={{ width: rem(18), height: rem(18) }} />,
      });
    }
  };

  const cancel = () => {
    close();
    navigate(-1);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={cancel}
        closeOnEscape={false}
        centered
        fullScreen={isMobile}
        size="lg"
        title={t("change-password")}
        mb="xs"
      >
        <Divider mb={8} />
        <Text mb={16} fw={500}>
          {t("enter-a-new-password-for-your-user")}
        </Text>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <PasswordInput
            label={t("old-password")}
            {...form.getInputProps("oldPassword")}
            withAsterisk
            mb="md"
            data-autofocus
            autoComplete="current-password"
            className="CurrentPassword"
            w="84%"
          />
          <SetPassword form={form} focus={false} password={password} />
          <Divider mb={8} />
          <Group justify="space-between" my={8} pt={16}>
            <Button type="submit">{t("update")}</Button>
            <Button variant="outline" onClick={cancel}>
              {t("cancel")}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
