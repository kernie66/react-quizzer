import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useApi } from "../contexts/ApiProvider";
import { useNavigate } from "react-router-dom";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Button, Divider, Group, Modal, rem } from "@mantine/core";
import SetEmailAddress from "../components/SetEmailAddress.js";
import { useForm } from "@mantine/form";
import { useErrorBoundary } from "react-error-boundary";
import { showNotification } from "@mantine/notifications";
import { TbCheck, TbX } from "react-icons/tb";

export default function ResetRequestPage() {
  const [opened, { close }] = useDisclosure(true);
  //const [formErrors, setFormErrors] = useState({});
  //const [modal, setModal] = useState(true);
  const [resetURL, setResetURL] = useState();
  const [language, setLanguage] = useState("en");
  const api = useApi();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showBoundary } = useErrorBoundary();
  const isMobile = useMediaQuery("(max-width: 50em)");

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => (value.length === 0 ? t("please-enter-a-valid-email-address") : null),
    },
  });

  useEffect(() => {
    const languageCode = i18n.resolvedLanguage;
    setLanguage(languageCode.split("-")[0]);
    const currentURL = window.location.href;
    setResetURL(currentURL.replace("/reset-request", "/reset"));
  }, []);

  const onSubmit = async () => {
    try {
      const response = await api.post("/auth/request-reset", {
        email: form.values.email,
        resetURL: resetURL,
        language: language,
      });
      if (response.ok) {
        close();
        showNotification({
          title: t("reset-password"),
          message: t("you-will-receive-an-email-with-instructions-to-reset-your-password"),
          color: "green",
          icon: <TbCheck style={{ width: rem(18), height: rem(18) }} />,
          autoClose: 5000,
        });
        navigate("/login");
      } else {
        showNotification({
          title: t("reset-password"),
          message: t("couldnt-request-a-password-reset"),
          color: "red",
          icon: <TbX style={{ width: rem(18), height: rem(18) }} />,
        });
      }
    } catch (error) {
      console.log(error);
      showBoundary(error);
    }
  };

  const cancelRequest = () => {
    navigate("/");
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={cancelRequest}
        closeOnEscape={false}
        centered
        fullScreen={isMobile}
        title={t("request-password-reset")}
      >
        <Divider mb={8} />
        <form onSubmit={form.onSubmit(onSubmit)}>
          <SetEmailAddress form={form} focus={true} newUser={false} />
          <Divider mb={8} />
          <Group justify="space-between" my={8} pt={16}>
            <Button type="submit">{t("reset-password")}</Button>
            <Button variant="outline" onClick={cancelRequest}>
              {t("cancel")}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
