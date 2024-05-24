import { TbCheck } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { useApi } from "../contexts/ApiProvider";
import { Loader, TextInput } from "@mantine/core";
import { trim } from "radash";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import isValidEmail from "../helpers/isValidEmail";

export default function SetEmailAddress({ form, focus, newUser = true }) {
  const api = useApi();
  const { t } = useTranslation();
  const [newEmail, setNewEmail] = useState("");
  const [emailOk, setEmailOk] = useState(false);

  const getEmailStatus = async (newEmailAddress) => {
    if (newEmailAddress) {
      try {
        const existingEmail = await api.get("/check", { email: newEmailAddress });
        if (existingEmail.status === 200) {
          return { exists: true, text: "Email exist" };
        } else {
          console.log("existingEmail", existingEmail);
          throw new Error("Server error", existingEmail);
        }
      } catch (error) {
        console.log("error", error);
        console.log("Email status error:", error.response.status);
        if (error.response.status === 404) {
          return { exists: false, text: "Email is free" };
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

  useEffect(() => {
    if (isError) {
      form.setFieldError("email", t("cannot-validate-the-email-address-server-not-responding"));
    }
  }, [form, isError, t]);

  useEffect(() => {
    let validEmail = false;

    if (emailStatus) {
      // Check if the email address is free
      if (!emailStatus.exists) {
        if (!newUser) {
          form.setFieldError("email", t("email-address-not-registered"));
        } else {
          validEmail = true;
        }
      }

      // Check if the email address is taken
      if (emailStatus.exists) {
        if (newUser) {
          form.setFieldError(
            "email",
            t("email-address-already-registered-did-you-forget-your-password"),
          );
        } else {
          validEmail = true;
        }
      }
    }
    console.log("validEmail", validEmail);
    setEmailOk(validEmail);
  }, [emailStatus, form, newUser, t]);

  return (
    <TextInput
      label={t("email-address")}
      {...form.getInputProps("email")}
      key={form.key("email")}
      withAsterisk
      mb="md"
      rightSection={
        isLoading ? (
          <Loader size="sm" />
        ) : (
          <TbCheck
            aria-label="checked"
            color="green"
            style={{ display: emailOk ? undefined : "none" }}
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
