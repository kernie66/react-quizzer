import { useApi } from "../contexts/ApiProvider";
import SetPassword from "../components/SetPassword.js";
import { useTranslation } from "react-i18next";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Button, Divider, Group, Modal, PasswordInput, Text, rem } from "@mantine/core";
import { useUser } from "../contexts/UserProvider.js";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const [opened, { close }] = useDisclosure(true);
  const api = useApi();
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 50em)");
  const { user } = useUser();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      oldPassword: "",
      password: "",
      password2: "",
    },
    validate: (values) => ({
      oldPassword: values.oldPassword.length === 0 ? t("please-enter-your-current-password") : null,
      password:
        values.password.length === 0
          ? `Values: ${values.password}` // t("please-select-a-password")
          : values.password === values.oldPassword
            ? t("please-enter-a-different-password-than-the-current")
            : null,
      password2: values.password2.length === 0 ? t("please-repeat-the-password") : null,
    }),
  });

  const onSubmit = async () => {
    console.log("Passwords:", form.values);
    const response = await api.put(`/users/${user.id}/password`, {
      oldPassword: form.values.oldPassword,
      newPassword: form.values.password,
    });
    if (response.status === 201) {
      showNotification({
        title: t("change-password"),
        message: t("your-password-has-been-updated"),
        color: "green",
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
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
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
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
          <SetPassword form={form} focus={false} />
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
