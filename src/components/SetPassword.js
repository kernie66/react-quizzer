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
  const [passwordCheck, setPasswordCheck] = useSetState({
    warning: "enter-5-characters-for-hints",
    suggestions: [],
    score: 0,
  });

  useEffect(() => {
    (async () => {
      const zxcvbnResult = await usePasswordStrength(debouncedPassword, [
        form.values.username,
        form.values.email,
        "Saab",
        "Quizzer",
      ]);
      let tooltipText = "enter-5-characters-for-hints";
      let suggestions = [];
      const score = zxcvbnResult.score;
      if (password.length >= 5) {
        tooltipText = "password-is-not-good-enough";
        if (zxcvbnResult.feedback.warning) {
          tooltipText = zxcvbnResult.feedback.warning;
        } else if (score === 3) {
          tooltipText = "password-strength-is-sufficient";
        } else if (score === 4) {
          tooltipText = "password-strength-is-very-good";
        }
        if (!isEmpty(zxcvbnResult.feedback.suggestions)) {
          suggestions = zxcvbnResult.feedback.suggestions;
        }
      }
      console.log("zxcvbnResult:", zxcvbnResult);
      setPasswordCheck({ warning: tooltipText, suggestions: suggestions, score: score });
    })();
  }, [debouncedPassword]);

  const updatePassword = async (event) => {
    const typedPassword = event.currentTarget.value;
    setPassword(typedPassword);
  };

  // Check password
  const checkPassword = () => {
    let passwordError;

    tooltipClose();
    if (password) {
      if (passwordCheck.score < 3) {
        passwordError = t("the-password-is-too-weak");
      }
    }
    form.setFieldError("password", passwordError);
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
        offset={{ mainAxis: 8, crossAxis: 80 }}
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
            onBlur={checkPassword}
          />
        </Popover.Target>
        <Popover.Dropdown bg="indigo.1" color="dark" my={4}>
          {passwordCheck.warning && (
            <Text size="sm" mb={8} color={passwordCheck.warningColor}>
              {t(`warnings.${passwordCheck.warning}`)}
            </Text>
          )}
          {!isEmpty(passwordCheck.suggestions) && (
            <>
              <Divider label={t("suggestions.suggestions")} labelPosition="left" />
              <List size="sm" my={4}>
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
