import { useNavigate } from "react-router-dom";
import Body from "../components/Body";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import { useTranslation } from "react-i18next";
import getNameFromEmail from "../helpers/getNameFromEmail.js";
import SetUsername from "../components/SetUsername.js";
import SetEmailAddress from "../components/SetEmailAddress.js";
import SetPassword from "../components/SetPassword.js";
import { sift } from "radash";
import { useErrorBoundary } from "react-error-boundary";
import { Button, Divider, Group, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

export default function RegistrationPage() {
  const [opened, { close }] = useDisclosure(true);
  const navigate = useNavigate();
  const api = useApi();
  const flash = useFlash();
  const { t } = useTranslation();
  const { showBoundary } = useErrorBoundary();
  const isMobile = useMediaQuery("(max-width: 50em)");

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      password2: "",
    },
    validate: {
      username: (value) => (value.length === 0 ? t("please-select-a-username") : null),
      email: (value) => (value.length === 0 ? t("please-enter-a-valid-email-address") : null),
      password: (value) => (value.length === 0 ? t("please-select-a-password") : null),
      password2: (value) => (value.length === 0 ? t("please-repeat-the-password") : null),
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

      const name = getNameFromEmail(form.values.email);
      const data = await api.register({
        username: form.values.username,
        name: name,
        email: form.values.email,
        password: form.values.password,
      });
      if (data.ok) {
        close();
        flash(t("you-have-successfully-registered"), "success");
        navigate("/login");
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
    <Body>
      <Modal
        opened={opened}
        onClose={close}
        closeOnEscape={false}
        closeOnClickOutside={false}
        fullScreen={isMobile}
        size="lg"
        title={t("user-registration")}
        yOffset="6rem"
      >
        <Divider mb={8} />
        <form onSubmit={form.onSubmit(onSubmit)}>
          <SetUsername form={form} />
          <SetEmailAddress form={form} />
          <SetPassword
            form={form}
            passwordUserInputs={[form.values.username, form.values.email, "Saab"]}
          />
          <Divider mb={8} />
          <Group justify="space-between" my={8} pt={16}>
            <Button type="submit">{t("register")}</Button>
            <Button variant="outline" onClick={cancel}>
              {t("cancel")}
            </Button>
          </Group>
        </form>
      </Modal>
    </Body>
  );
}
