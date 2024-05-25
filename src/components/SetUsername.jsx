import { useTranslation } from "react-i18next";
import { useApi } from "../contexts/ApiProvider";
import isInvalidUsername from "../helpers/isInvalidUsername";
import { Loader, TextInput } from "@mantine/core";
import { trim } from "radash";
import { useQuery } from "@tanstack/react-query";
import { TbCheck } from "react-icons/tb";
import { useEffect, useState } from "react";

export default function SetUsername({ form, focus, newUser = true }) {
  const api = useApi();
  const { t } = useTranslation();
  const [newUsername, setNewUsername] = useState("");
  const [usernameOk, setUsernameOk] = useState(false);

  const getUsernameStatus = async (newUsername) => {
    if (newUsername) {
      try {
        const existingUsername = await api.get("/check", { username: newUsername });
        if (existingUsername.status === 200) {
          return { exists: true, text: "username-exist" };
        } else {
          throw new Error("Server error", existingUsername);
        }
      } catch (error) {
        if (error.response.status === 404) {
          return { exists: false, text: "username-is-free" };
        }
        throw new Error("Error checking username", error);
      }
    }
    return "";
  };

  const {
    isLoading,
    isError,
    data: usernameStatus,
  } = useQuery({
    queryKey: ["username", { username: newUsername }],
    queryFn: () => getUsernameStatus(newUsername),
    retry: false,
    gcTime: 1000,
  });

  // Check username
  const checkUsername = () => {
    let formUsername = trim(form.getValues().username.toLowerCase());
    form.setValues({ username: formUsername });
    if (formUsername) {
      const invalidUsername = isInvalidUsername(formUsername);
      if (invalidUsername) {
        form.setFieldError("username", t(invalidUsername));
        formUsername = "";
      }
    }
    setNewUsername(formUsername);
  };

  useEffect(() => {
    if (isError) {
      form.setFieldError("username", t("cannot-validate-the-username-server-not-responding"));
    }
  }, [form, isError, t]);

  useEffect(() => {
    let validUsername = false;

    if (usernameStatus) {
      // Check if the username is free
      if (!usernameStatus.exists) {
        if (!newUser) {
          form.setFieldError("username", t("username-not-registered-for-any-quizzer"));
        } else {
          validUsername = true;
        }
      }

      // Check if the username is taken
      if (usernameStatus.exists) {
        if (newUser) {
          form.setFieldError("username", t("username-already-registered"));
        } else {
          validUsername = true;
        }
      }
    }
    setUsernameOk(validUsername);
  }, [usernameStatus, form, newUser, t]);

  return (
    <TextInput
      label={t("username")}
      key={form.key("username")}
      {...form.getInputProps("username")}
      withAsterisk
      mb="md"
      rightSection={
        isLoading ? (
          <Loader size="sm" />
        ) : (
          <TbCheck
            aria-label="checked"
            color="green"
            style={{ display: usernameOk ? undefined : "none" }}
          />
        )
      }
      onBlur={checkUsername}
      data-autofocus={focus}
      autoComplete="username"
      className="SetUsername"
    />
  );
}
