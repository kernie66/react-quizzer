import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Body from "../components/Body";
import { useApi } from "../contexts/ApiProvider";
import { useForm } from "@mantine/form";
import { Button, Divider, Group, Modal, Text, rem } from "@mantine/core";
import SetPassword from "../components/SetPassword.js";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export default function ResetPage() {
  const [opened, { close }] = useDisclosure(true);
  const api = useApi();
  const navigate = useNavigate();
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");
  const userId = new URLSearchParams(search).get("id");
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 50em)");

  const form = useForm({
    initialValues: {
      password: "",
      password2: "",
    },
    validate: {
      password: (value) => (value.length === 0 ? t("please-select-a-password") : null),
      password2: (value) => (value.length === 0 ? t("please-repeat-the-password") : null),
    },
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const onSubmit = async () => {
    const response = await api.put("/auth/reset-password", {
      userId,
      token,
      password: form.values.password,
    });
    if (response.ok) {
      close();
      showNotification({
        title: t("reset-password"),
        message: t("your-password-has-been-successfully-reset"),
        color: "green",
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        autoClose: 5000,
      });
      navigate("/login");
    } else {
      showNotification({
        title: t("reset-password"),
        message: t("password-could-not-be-reset-please-try-again"),
        color: "red",
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
      });
      navigate("/reset-request");
    }
  };

  const cancel = () => {
    close();
    navigate("/login");
  };

  return (
    <Body>
      <Modal
        opened={opened}
        onClose={cancel}
        closeOnEscape={false}
        centered
        fullScreen={isMobile}
        size="lg"
        title={t("reset-your-password")}
        mb="xs"
      >
        <Divider mb={8} />
        <Text mb={16} fw={500}>
          {t("enter-a-new-password-for-your-user")}
        </Text>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <SetPassword form={form} focus={true} />
          <Divider mb={8} />
          <Group justify="space-between" my={8} pt={16}>
            <Button type="submit">{t("restore")}</Button>
            <Button variant="outline" onClick={cancel}>
              {t("cancel")}
            </Button>
          </Group>
        </form>
      </Modal>
    </Body>
  );
}
