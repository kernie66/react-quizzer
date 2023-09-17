import { useTranslation } from "react-i18next";
import { useApi } from "../contexts/ApiProvider.js";
import { useEffect, useState } from "react";
import InputField from "./InputField.js";
import isValidEmail from "../helpers/isValidEmail.js";

export default function SetEmailAddress({
  emailAddressValue,
  setEmailAddressValue,
  emailAddressError,
  setEmailAddressError,
  emailAddressField,
}) {
  const api = useApi();
  const { t } = useTranslation();
  const [isValid, setIsValid] = useState("");

  // Check email address
  useEffect(() => {
    let isActive = true;

    const checkEmail = async (email) => {
      let emailError,
        emailValid = "";

      if (!isValidEmail(email)) {
        emailError = t("please-enter-a-valid-email-address");
      } else {
        const existingEmail = await api.get("/check", { email });
        if (existingEmail.status === 200) {
          emailError = t("email-address-already-registered-did-you-forget-your-password");
        } else if (existingEmail.status === 404) {
          emailValid = t("email-address-is-available");
        } else {
          emailError = t("cannot-validate-the-email-address-server-not-responding");
        }
      }
      if (isActive) {
        console.log(emailError);
        setEmailAddressError(emailError);
        if (!emailError) {
          setIsValid(emailValid);
        }
      }
    };

    if (emailAddressValue !== undefined) {
      try {
        checkEmail(emailAddressValue);
        console.log("Email error:", emailAddressError);
      } catch (error) {
        setEmailAddressError(t("cannot-validate-the-email-address-server-not-responding"));
        console.log("Error checking email address:", error);
      }
    }

    return () => {
      isActive = false;
    };
  }, [emailAddressValue]);

  const onInput = (email) => {
    setEmailAddressValue(email.toLowerCase());
  };

  return (
    <InputField
      label={t("email-address")}
      name="email"
      fieldRef={emailAddressField}
      error={emailAddressError}
      isValid={isValid}
      onBlur={onInput}
    />
  );
}
