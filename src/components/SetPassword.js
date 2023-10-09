import PasswordStrengthBar from "react-password-strength-bar";
import { useTranslation } from "react-i18next";
// import { Popover, PopoverBody, PopoverHeader, UncontrolledTooltip } from "reactstrap";
import zxcvbn from "zxcvbn";
import { useState } from "react";
import getPasswordPopoverButtons from "../helpers/getPasswordPopoverButtons.js";
import { List, PasswordInput, Popover, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// const zxcvbn = lazy(() => import(zxcvbn));

const initialPasswordStrength = zxcvbn("");

export default function SetPassword({ form, passwordUserInputs }) {
  const [popoverOpened, { open: popoverOpen, close: popoverClose }] = useDisclosure(false);
  const [tooltipOpened, { open: tooltipOpen, close: tooltipClose }] = useDisclosure(false);
  const [password, setPassword] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState({});
  const [passwordWarning, setPasswordWarning] = useState();
  const [passwordWarningColor, setPasswordWarningColor] = useState();
  const [passwordSuggestion, setPasswordSuggestion] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(initialPasswordStrength);
  const [shortScoreWord, scoreWords] = getPasswordPopoverButtons();
  const { t } = useTranslation();

  const setScore = (score, feedback) => {
    setPasswordScore(score);
    setPasswordFeedback(feedback);
    const strengthData = zxcvbn(form.values.password, passwordUserInputs);
    console.log("Strength:", strengthData);
    console.log("Guesses:", new Intl.NumberFormat().format(strengthData.guesses));
    setPasswordStrength(strengthData);
    if (score > 0) {
      popoverOpen();
    } else {
      popoverClose();
    }
  };

  // Check password score
  const checkPasswordScore = (event) => {
    const typedPassword = event.currentTarget.value;
    setPassword(typedPassword);
    let tooltipText = t("enter-5-characters-for-hints");
    setPasswordWarningColor("text-white");
    if (typedPassword.length >= 5) {
      tooltipText = t("password-is-not-good-enough");
      if (passwordFeedback.warning) {
        tooltipText = "Warning: " + passwordFeedback.warning;
        setPasswordWarningColor("text-warning");
      } else if (passwordScore === 3) {
        tooltipText = t("password-strength-is-sufficient");
      } else if (passwordScore === 4) {
        tooltipText = t("password-strength-is-very-good");
      }
    }
    setPasswordWarning(tooltipText);
    if (passwordFeedback.suggestions) {
      setPasswordSuggestion(passwordFeedback.suggestions);
    } else {
      setPasswordSuggestion("");
    }
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
            onChange={checkPasswordScore}
            onFocus={tooltipOpen}
            onBlur={tooltipClose}
          />
        </Popover.Target>
        <Popover.Dropdown>
          {passwordWarning !== "" && <Text color={passwordWarningColor}>{passwordWarning}</Text>}
          {passwordSuggestion && (
            <List className="text-body">
              {passwordSuggestion.map((suggestion) => (
                <List.Item key={suggestion.id}>{suggestion}</List.Item>
              ))}
            </List>
          )}
        </Popover.Dropdown>
      </Popover>
      <Popover opened={popoverOpened}>
        <Popover.Target>
          <PasswordStrengthBar
            password={form.values.password}
            minLength={5}
            shortScoreWord={shortScoreWord}
            scoreWords={scoreWords}
            onChangeScore={setScore}
          />
        </Popover.Target>
        <Popover.Dropdown>
          <div>
            <div className="mb-1">
              <strong>Score: </strong>
              {passwordStrength.score} (of 4)
              <br />
              <strong>Number of guesses: </strong>
              {new Intl.NumberFormat().format(passwordStrength.guesses)}
              <br />
              {passwordStrength.crack_times_display && (
                <div>
                  <strong>Crack times:</strong>
                  <li key="online_throttling">
                    Online throttling:{" "}
                    {passwordStrength.crack_times_display.online_throttling_100_per_hour}
                  </li>
                  <li key="online_no_throttling">
                    Online no throttling:{" "}
                    {passwordStrength.crack_times_display.online_no_throttling_10_per_second}
                  </li>
                  <li key="offline_slow">
                    Offline slow:{" "}
                    {passwordStrength.crack_times_display.offline_slow_hashing_1e4_per_second}
                  </li>
                  <li key="offline_fast">
                    Offline fast:{" "}
                    {passwordStrength.crack_times_display.offline_fast_hashing_1e10_per_second}
                  </li>
                </div>
              )}
              {passwordStrength.sequence.length !== 0 && (
                <div>
                  <strong>Patterns:</strong>
                  {passwordStrength.sequence.map((sequence) => (
                    <li key={sequence.id}>
                      <em>{sequence.pattern}</em> ({sequence.token})
                    </li>
                  ))}
                </div>
              )}
            </div>
            <div className="border-top border-info text-info">
              <small>
                {t("information-provided-by")}{" "}
                <em>
                  <a href="https://github.com/dropbox/zxcvbn" target="_blank" rel="noreferrer">
                    zxcvbn
                  </a>
                </em>
              </small>
            </div>
          </div>
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
