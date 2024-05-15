import { useTranslation } from "react-i18next";
import { useApi } from "../contexts/ApiProvider";
import isInvalidUsername from "../helpers/isInvalidUsername";
import { Loader, TextInput } from "@mantine/core";
import { trim } from "radash";
import { useQuery } from "@tanstack/react-query";
import { TbCheck } from "react-icons/tb";
import { useState } from "react";

export default function SetUsername({ form, focus, newUser = true }) {
  const api = useApi();
  const { t } = useTranslation();
  const [newUsername, setNewUsername] = useState("");

  const getUsernameStatus = async (newUsername, newUser) => {
    if (newUsername) {
      try {
        const existingUsername = await api.get("/check", { username: newUsername });
        if (existingUsername.status === 200) {
          return "Username exist";
        } else {
          throw new Error("Server error", existingUsername);
        }
      } catch (error) {
        if (newUser && error.response.status === 404) {
          return "Username is free";
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
    queryKey: ["username", { username: newUsername, newUser }],
    queryFn: () => getUsernameStatus(newUsername, newUser),
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

  if (isError) {
    form.setFieldError("username", t("cannot-validate-the-username-server-not-responding"));
  }

  if (usernameStatus === "Username is free") {
    if (!newUser) {
      form.setFieldError("username", t("please-enter-a-username"));
    }
  }

  if (usernameStatus === "Username exist") {
    if (newUser) {
      form.setFieldError("username", t("username-already-registered"));
    }
  }

  return (
    <TextInput
      label={t("username")}
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
            style={{ display: usernameStatus === "Username is free" ? undefined : "none" }}
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
