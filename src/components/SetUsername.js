import { useEffect, useState } from "react";
import InputField from "./InputField.js";
import { useTranslation } from "react-i18next";
import { useApi } from "../contexts/ApiProvider.js";
import isInvalidUsername from "../helpers/isInvalidUsername.js";

export default function SetUsername({
  usernameValue,
  setUsernameValue,
  usernameError,
  setUsernameError,
  usernameField,
}) {
  const api = useApi();
  const { t } = useTranslation();
  const [isValid, setIsValid] = useState("");

  // Check username
  useEffect(() => {
    let isActive = true;

    const checkUser = async (username) => {
      let userError,
        userValid = "";

      const usernameCheck = isInvalidUsername(username);
      userError = t(usernameCheck);

      if (!userError) {
        const existingUser = await api.get("/check", { username });
        if (existingUser.status === 200) {
          userError = t("username-already-registered");
        } else if (existingUser.status === 404) {
          userValid = t("username-is-available");
        } else {
          userError = t("cannot-validate-the-username-server-not-responding");
        }
      }
      if (isActive) {
        console.log(userError);
        setUsernameError(userError);
        if (!userError) {
          setIsValid(userValid);
        } else {
          setIsValid("");
        }
      }
    };

    if (usernameValue !== undefined) {
      try {
        checkUser(usernameValue);
        console.log("User error:", usernameError);
      } catch (error) {
        setUsernameError(t("cannot-validate-the-username-server-not-responding"));
        console.log("Error checking username:", error);
      }
    }

    return () => {
      isActive = false;
    };
  }, [usernameValue]);

  const onInput = (username) => {
    setUsernameValue(username.toLowerCase());
  };

  return (
    <InputField
      label={t("username")}
      name="username"
      fieldRef={usernameField}
      error={usernameError}
      isValid={isValid}
      onBlur={onInput}
    />
  );
}
