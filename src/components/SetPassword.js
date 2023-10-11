import { useTranslation } from "react-i18next";
import { Divider, List, PasswordInput, Popover, Text } from "@mantine/core";
import { useDebouncedValue, useDisclosure, useSetState } from "@mantine/hooks";
import { useEffect, useState } from "react";
// import PasswordStrengthBar from "./PasswordStrengthBar.js";
import usePasswordStrength from "../hooks/usePasswordStrength.js";
import { isEmpty } from "radash";

export default function SetPassword({ form }) {
  const [tooltipOpened, { open: tooltipOpen, close: tooltipClose }] = useDisclosure(false);
  const [password, setPassword] = useState("");
  const [debouncedPassword] = useDebouncedValue(password, 200);
  const { t } = useTranslation();
  const [passwordCheck, setPasswordCheck] = useSetState({});

  useEffect(() => {
    (async () => {
      const initialValues = await usePasswordStrength("");
      initialValues.warning = "enter-5-characters-for-hints";
      initialValues.suggestions = [];
      setPasswordCheck(initialValues);
      console.log("Init:", initialValues);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const zxcvbnResult = await usePasswordStrength(debouncedPassword);
      if (password.length < 5) {
        zxcvbnResult.warning = "enter-5-characters-for-hints";
        zxcvbnResult.suggestions = [];
      } else {
        if (zxcvbnResult.feedback.warning || !isEmpty(zxcvbnResult.feedback.suggestions)) {
          zxcvbnResult.warning = zxcvbnResult.feedback.warning;
          zxcvbnResult.suggestions = zxcvbnResult.feedback.suggestions;
        } else {
          zxcvbnResult.warning = null;
          zxcvbnResult.suggestions = [];
        }
      }
      console.log("zxcvbnResult:", zxcvbnResult);
      setPasswordCheck(zxcvbnResult);
    })();
  }, [debouncedPassword]);

  const updatePassword = async (event) => {
    const typedPassword = event.currentTarget.value;
    setPassword(typedPassword);
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
      <Popover
        opened={tooltipOpened}
        position="top-start"
        offset={{ mainAxis: 8, crossAxis: 72 }}
        withArrow
        arrowSize={10}
      >
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
        <Popover.Dropdown bg="indigo.1" color="dark">
          {passwordCheck.warning && (
            <Text size="sm" my="xs" color={passwordCheck.warningColor}>
              {t(`warnings.${passwordCheck.warning}`)}
            </Text>
          )}
          {!isEmpty(passwordCheck.suggestions) && (
            <>
              <Divider label="Suggestions" labelPosition="left" />
              <List size="sm" my="xs">
                {passwordCheck.suggestions.map((suggestion) => (
                  <List.Item key={suggestion.id}>{t(`suggestions.${suggestion}`)}</List.Item>
                ))}
              </List>
            </>
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
