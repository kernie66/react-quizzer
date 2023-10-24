import Body from "../components/Body";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import SetPassword from "../components/SetPassword.js";
import { useTranslation } from "react-i18next";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { Button, Divider, Group, Modal, Text, TextInput } from "@mantine/core";

export default function ChangePasswordPage() {
  const [opened, { close }] = useDisclosure(true);
  const api = useApi();
  const flash = useFlash();
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 50em)");

  const form = useForm({
    initialValues: {
      oldPassword: "",
      password: "",
      password2: "",
    },
    validate: {
      oldPassword: (value) => (value.length === 0 ? t("please-enter-your-current-password") : null),
      password: (value) => (value.length === 0 ? t("please-select-a-password") : null),
      password2: (value) => (value.length === 0 ? t("please-repeat-the-password") : null),
    },
  });

  const onSubmit = async () => {
    const response = await api.put("/me", {
      oldPassword: form.values.oldPassword,
      password: form.values.password,
    });
    if (response.ok) {
      flash(t("your-password-has-been-updated"), "success");
      close();
      //        navigate("/me");
    } else {
      console.log("Error");
    }
  };

  const cancel = () => {
    close();
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
        title={t("change-password")}
        mb="xs"
      >
        <Divider mb={8} />
        <Text mb={16} fw={500}>
          {t("enter-a-new-password-for-your-user")}
        </Text>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            label={t("old-password")}
            {...form.getInputProps("oldPassword")}
            withAsterisk
            mb="md"
            data-autofocus={focus}
            className="CurrentPassword"
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
    </Body>
  );
}
