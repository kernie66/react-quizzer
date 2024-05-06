import { useTranslation } from "react-i18next";
import { Divider, Grid, List, PasswordInput, Popover, Text } from "@mantine/core";
import { useDebouncedValue, useDisclosure, useSetState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import getPasswordStrength from "../helpers/getPasswordStrength";
import { isEmpty } from "radash";
import PasswordStrength from "./PasswordStrength.jsx";
import PasswordStrengthBar from "./PasswordStrengthBar.jsx";

export default function SetPassword({ form, focus = false }) {
  const [tooltipOpened, { open: tooltipOpen, close: tooltipClose }] = useDisclosure(false);
  const [password, setPassword] = useState("");
  const [userInputs, setUserInputs] = useState([]);
  const [debouncedPassword] = useDebouncedValue(password, 200);
  const { t } = useTranslation();
  const [passwordCheck, setPasswordCheck] = useSetState({
    warning: "enter-5-characters-for-hints",
    suggestions: [],
    score: 0,
  });

  useEffect(() => {
    (async () => {
      const formValues = form.getValues();
      const _userInputs = [
        formValues.username,
        formValues.email,
        formValues.name,
        "Saab",
        "Quizzer",
        "lösenord",
      ];
      setUserInputs(_userInputs);
      const zxcvbnResult = await getPasswordStrength(debouncedPassword, _userInputs);
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
  }, [debouncedPassword, password.length, setPasswordCheck, form]);

  // Typing password on change
  const updatePassword = (event) => {
    const typedPassword = event.target.value;
    console.log("typedPassword", typedPassword);
    setPassword(typedPassword);
    tooltipOpen();
  };

  // Check password score on blur
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
    const formValues = form.getValues();
    if (formValues.password2 && formValues.password2 !== formValues.password) {
      passwordsError = t("the-passwords-doesnt-match");
    }
    form.setFieldError("password2", passwordsError);
  };

  return (
    <>
      <Grid align="flex-start" justify="flex-start" className="SetPassword">
        <Grid.Col span="auto">
          <Popover
            opened={tooltipOpened}
            position="top-start"
            offset={24}
            withArrow
            arrowSize={12}
            zIndex={1000}
          >
            <Popover.Target>
              <PasswordInput
                label={t("password")}
                {...form.getInputProps("password")}
                withAsterisk
                mb="md"
                mr="auto"
                autoComplete="new-password"
                onChange={updatePassword}
                onBlur={checkPassword}
                data-autofocus={focus}
              />
            </Popover.Target>
            <Popover.Dropdown bg="red.1" color="dark" my={4}>
              {passwordCheck.warning && (
                <Text size="sm" mb={8} color={passwordCheck.warningColor}>
                  {t(`warnings.${passwordCheck.warning}`)}
                </Text>
              )}
              {!isEmpty(passwordCheck.suggestions) && (
                <>
                  <Divider label={t("suggestions.suggestions")} labelPosition="left" />
                  <List size="sm" my={4}>
                    {passwordCheck.suggestions.map((suggestion, index) => (
                      <List.Item key={index}>{t(`suggestions.${suggestion}`)}</List.Item>
                    ))}
                  </List>
                </>
              )}
            </Popover.Dropdown>
          </Popover>
          <PasswordStrengthBar strength={passwordCheck.score} />
          <PasswordInput
            label={t("repeat-password")}
            {...form.getInputProps("password2")}
            withAsterisk
            mb="md"
            autoComplete="new-password"
            onBlur={checkPassword2}
          />
        </Grid.Col>
        <Grid.Col span="content" pt="2rem">
          <PasswordStrength password={debouncedPassword} passwordUserInputs={userInputs} />
        </Grid.Col>
      </Grid>
    </>
  );
}
