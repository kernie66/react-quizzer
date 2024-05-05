import { useTranslation } from "react-i18next";
import { useApi } from "../contexts/ApiProvider";
import isValidEmail from "../helpers/isValidEmail";
import { TextInput } from "@mantine/core";
import { trim } from "radash";

export default function SetEmailAddress({ form, focus = false, newUser = true }) {
  const api = useApi();
  const { t } = useTranslation();

  // Check email address
  const checkEmail = async () => {
    let emailError;
    const validStatus = [200, 404];

    const newEmailAddress = trim(form.getValues().email.toLowerCase());
    form.setFieldValue("email", newEmailAddress);
    if (newEmailAddress) {
      if (!isValidEmail(newEmailAddress)) {
        emailError = t("please-enter-a-valid-email-address");
      } else {
        const existingEmail = await api.get("/check", { email: newEmailAddress });
        if (newUser && existingEmail.status === 200) {
          emailError = t("email-address-already-registered-did-you-forget-your-password");
        } else if (!newUser && existingEmail.status === 404) {
          emailError = t("email-address-not-registered");
        } else if (!validStatus.includes(existingEmail.status)) {
          emailError = t("cannot-validate-the-email-address-server-not-responding");
        }
      }
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
      data-autofocus={focus}
      className="SetEmailAddress"
    />
  );
}
