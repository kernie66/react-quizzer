// const zxcvbn = lazy(() => import(zxcvbn));
import { useTranslation } from "react-i18next";
import { useDisclosure, useSetState } from "@mantine/hooks";
// import { useState } from "react";
import { Popover } from "@mantine/core";
import usePasswordStrength from "../hooks/usePasswordStrength.js";

export default function PasswordStrengthBar({ password, passwordUserInputs }) {
  const [popoverOpened, { open: popoverOpen, close: popoverClose }] = useDisclosure(false);
  const [passwordStrength, setPasswordStrength] = useSetState();
  // const [passwordScore, setPasswordScore] = useState(0);
  // const [passwordFeedback, setPasswordFeedback] = useState({});
  const { t } = useTranslation();

  const strengthData = usePasswordStrength(password, passwordUserInputs);
  setPasswordStrength(strengthData);
  popoverOpen();
  console.log(strengthData);
  popoverClose();
  /*
  const setScore = (score, feedback) => {
    setPasswordScore(score);
    setPasswordFeedback(feedback);
    const strengthData = zxcvbn(password, passwordUserInputs);
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
  const checkPasswordScore = () => {
    let tooltipText = t("enter-5-characters-for-hints");
    setPasswordWarningColor("text-white");
    if (password.length >= 5) {
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
*/
  return (
    <Popover opened={popoverOpened}>
      <Popover.Target>
        <PasswordStrengthBar />
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
  );
}
