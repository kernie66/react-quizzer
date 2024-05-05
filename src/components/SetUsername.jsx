import { useTranslation } from "react-i18next";
import { useApi } from "../contexts/ApiProvider";
import isInvalidUsername from "../helpers/isInvalidUsername";
import { TextInput } from "@mantine/core";
import { trim } from "radash";

export default function SetUsername({ form, focus = true }) {
  const api = useApi();
  const { t } = useTranslation();

  // Check username
  const checkUsername = async () => {
    let usernameError;

    const newUsername = trim(form.getValues().username.toLowerCase());
    form.setFieldValue("username", newUsername);
    if (newUsername) {
      const invalidUsername = isInvalidUsername(newUsername);
      usernameError = invalidUsername && t(invalidUsername);

      if (!usernameError) {
        const existingUser = await api.get("/check", { username: newUsername });
        if (existingUser.status === 200) {
          usernameError = t("username-already-registered");
        } else if (existingUser.status !== 404) {
          usernameError = t("cannot-validate-the-username-server-not-responding");
        }
      }
    }

    form.setFieldError("username", usernameError);
    return Promise.resolve(true);
  };

  return (
    <TextInput
      label={t("username")}
      {...form.getInputProps("username")}
      withAsterisk
      mb="md"
      onBlur={checkUsername}
      data-autofocus={focus}
      className="SetUsername"
    />
  );
}
