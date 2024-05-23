import { useTranslation } from "react-i18next";
import { Divider, Grid, List, PasswordInput, Popover, Text } from "@mantine/core";
import { useDebouncedValue, useDisclosure, useSetState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import getPasswordStrength from "../helpers/getPasswordStrength";
import { isEmpty } from "radash";
import PasswordStrength from "./PasswordStrength.jsx";
import PasswordStrengthBar from "./PasswordStrengthBar.jsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function SetPassword({ form, focus = false, password = "" }) {
  const [tooltipOpened, { open: tooltipOpen, close: tooltipClose }] = useDisclosure(false);
  // const [password, setPassword] = useState("");
  const [userInputs, setUserInputs] = useState([]);
  const [debouncedPassword] = useDebouncedValue(password, 200);
  const { t } = useTranslation();
  const [passwordCheck, setPasswordCheck] = useSetState({
    warning: "enter-5-characters-for-hints",
    suggestions: [],
    score: 0,
  });

  const {
    isError,
    isLoading,
    data: passwordStrength,
  } = useQuery({
    queryKey: ["strength", { data: debouncedPassword, userInputs: userInputs }],
    queryFn: () => getPasswordStrength(debouncedPassword, userInputs),
    // initialData: { score: 0, guesses: 0, feedback: { warning: "", suggestions: "" } },
    placeholderData: keepPreviousData,
    // enabled: !debouncedPassword || debouncedPassword.length >= 5,
    staleTime: Infinity,
    gcTime: 1000,
  });

  useEffect(() => {
    const formValues = form.getValues();
    const _userInputs = [
      formValues.username || "",
      formValues.email || "",
      formValues.name || "",
      "Saab",
      "Quizzer",
      "lösenord",
    ];
    setUserInputs(_userInputs);
  }, [form]);

  useEffect(() => {
    let tooltipText = "enter-5-characters-for-hints";
    let suggestions = [];
    const score = passwordStrength?.score;
    if (debouncedPassword.length >= 5) {
      tooltipText = "password-is-not-good-enough";
      if (passwordStrength?.feedback.warning) {
        tooltipText = passwordStrength?.feedback.warning;
      } else if (score === 3) {
        tooltipText = "password-strength-is-sufficient";
      } else if (score === 4) {
        tooltipText = "password-strength-is-very-good";
      }
      if (!isEmpty(passwordStrength?.feedback.suggestions)) {
        suggestions = passwordStrength?.feedback.suggestions;
      }
    }
    setPasswordCheck({ warning: tooltipText, suggestions: suggestions, score: score });
  }, [debouncedPassword, passwordStrength, setPasswordCheck]);

  useEffect(() => {
    if (password) {
      tooltipOpen();
    }
  }, [password, tooltipOpen]);

  // Check password score on blur
  const checkPassword = () => {
    let passwordError;

    tooltipClose();
    if (password) {
      if (passwordStrength.score < 3) {
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
                onBlur={checkPassword}
                data-autofocus={focus}
              />
            </Popover.Target>
            <Popover.Dropdown bg="blue.1" color="dark" my={4}>
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
          <input label="Username" hidden autoComplete="username" />
        </Grid.Col>
        <Grid.Col span="content" pt="2rem">
          <PasswordStrength passwordStrength={passwordStrength} disabled={isError || isLoading} />
        </Grid.Col>
      </Grid>
    </>
  );
}
