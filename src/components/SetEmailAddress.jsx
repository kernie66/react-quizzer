import { TbCheck } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { useApi } from "../contexts/ApiProvider";
import isValidEmail from "../helpers/isValidEmail";
import { Loader, TextInput } from "@mantine/core";
import { trim } from "radash";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function SetEmailAddress({ form, focus, newUser = true }) {
  const api = useApi();
  const { t } = useTranslation();
  const [newEmail, setNewEmail] = useState("");

  const getEmailStatus = async (newEmailAddress) => {
    if (newEmailAddress) {
      try {
        const existingEmail = await api.get("/check", { email: newEmailAddress });
        if (existingEmail.status === 200) {
          return "Email exist";
        } else {
          throw new Error("Server error", existingEmail);
        }
      } catch (error) {
        console.log("Email status error:", error.response.status);
        if (newUser && error.response.status === 404) {
          return "Email is free";
        }
        throw new Error("Error checking email", error);
      }
    }
    return "";
  };

  const {
    isLoading,
    isError,
    data: emailStatus,
  } = useQuery({
    queryKey: ["email", { email: newEmail }],
    queryFn: () => getEmailStatus(newEmail),
    retry: false,
    gcTime: 1000,
  });

  const checkEmail = () => {
    let formEmailAddress = trim(form.getValues().email.toLowerCase());
    form.setValues({ email: formEmailAddress });
    if (formEmailAddress) {
      if (!isValidEmail(formEmailAddress)) {
        form.setFieldError("email", t("please-enter-a-valid-email-address"));
        formEmailAddress = "";
      }
    }
    setNewEmail(formEmailAddress);
  };

  if (isError) {
    form.setFieldError("email", t("cannot-validate-the-email-address-server-not-responding"));
  }

  useEffect(() => {
    if (emailStatus === "Email is free") {
      if (!newUser) {
        form.setFieldError("email", t("email-address-not-registered"));
      }
    }

    if (emailStatus === "Email exist") {
      if (newUser) {
        form.setFieldError(
          "email",
          t("email-address-already-registered-did-you-forget-your-password"),
        );
      }
    }
  }, [emailStatus, form, newUser, t]);

  return (
    <TextInput
      label={t("email-address")}
      {...form.getInputProps("email")}
      withAsterisk
      mb="md"
      rightSection={
        isLoading ? (
          <Loader size="sm" />
        ) : (
          <TbCheck
            aria-label="checked"
            color="green"
            style={{ display: emailStatus === "Email is free" ? undefined : "none" }}
          />
        )
      }
      onBlur={checkEmail}
      data-autofocus={focus}
      autoComplete="username"
      className="SetEmailAddress"
    />
  );
}
