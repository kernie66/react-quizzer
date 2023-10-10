import { useTranslation } from "react-i18next";
import { List, PasswordInput, Popover, Text } from "@mantine/core";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { useDeferredValue, useEffect, useState } from "react";
// import PasswordStrengthBar from "./PasswordStrengthBar.js";
import usePasswordStrength from "../hooks/usePasswordStrength.js";

export default function SetPassword({ form }) {
  const [tooltipOpened, { open: tooltipOpen, close: tooltipClose }] = useDisclosure(false);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useSetState({ warning: "", suggestion: "" });
  const { t } = useTranslation();

  useEffect(() => {
    const initialValues = usePasswordStrength("");
    setPasswordCheck(initialValues);
    console.log("Init:", initialValues);
  }, []);

  const updatePassword = (event) => {
    const typedPassword = event.currentTarget.value;
    // NOTE: useDeferredValue is React v18 only, for v17 or lower use debouncing
    const deferredPassword = useDeferredValue(typedPassword);

    setPassword(deferredPassword);
    const zxcvbnResult = usePasswordStrength(deferredPassword);
    console.log("zxcvbnResult:", zxcvbnResult);
    setPasswordCheck(zxcvbnResult);
  };

  // Check password 2
  const checkPassword2 = () => {
    let passwordsError;

    if (form.values.password2) {
      if (form.values.password2 !== form.values.password) {
        passwordsError = t("the-passwords-doesnt-match");
      }
    }
    form.setFieldError("password2", passwordsError);
  };

  return (
    <div>
      <Popover opened={tooltipOpened}>
        <Popover.Target>
          <PasswordInput
            label={t("password")}
            {...form.getInputProps("password")}
            value={password}
            withAsterisk
            mb="md"
            autoComplete="new-password"
            onChange={updatePassword}
            onFocus={tooltipOpen}
            onBlur={tooltipClose}
          />
        </Popover.Target>
        <Popover.Dropdown>
          {passwordCheck.warning !== "" && (
            <Text color={passwordCheck.warningColor}>{passwordCheck.warning}</Text>
          )}
          {passwordCheck.suggestion && (
            <List className="text-body">
              {passwordCheck.suggestion.map((suggestion) => (
                <List.Item key={suggestion.id}>{suggestion}</List.Item>
              ))}
            </List>
          )}
        </Popover.Dropdown>
      </Popover>
      <PasswordInput
        label={t("repeat-password")}
        {...form.getInputProps("password2")}
        withAsterisk
        mb="md"
        autoComplete="new-password"
        onBlur={checkPassword2}
      />
    </div>
  );
}
