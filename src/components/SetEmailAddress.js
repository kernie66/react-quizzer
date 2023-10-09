import { useTranslation } from "react-i18next";
import { useApi } from "../contexts/ApiProvider.js";
import isValidEmail from "../helpers/isValidEmail.js";
import { TextInput } from "@mantine/core";
import { trim } from "radash";

export default function SetEmailAddress({ form }) {
  const api = useApi();
  const { t } = useTranslation();

  // Check email address
  const checkEmail = async () => {
    let emailError;

    const newEmailAddress = trim(form.values.email.toLowerCase());
    form.setFieldValue("email", newEmailAddress);
    if (newEmailAddress) {
      if (!isValidEmail(newEmailAddress)) {
        emailError = t("please-enter-a-valid-email-address");
      } else {
        const existingEmail = await api.get("/check", { email: newEmailAddress });
        if (existingEmail.status === 200) {
          emailError = t("email-address-already-registered-did-you-forget-your-password");
        } else if (existingEmail.status !== 404) {
          emailError = t("cannot-validate-the-email-address-server-not-responding");
        }
      }
    } else {
      emailError = t("please-enter-a-valid-email-address");
    }
    form.setFieldError("email", emailError);
    return Promise.resolve("Email checked");
  };

  return (
    <TextInput
      label={t("email-address")}
      {...form.getInputProps("email")}
      withAsterisk
      mb="md"
      onBlur={checkEmail}
    />
  );
}
