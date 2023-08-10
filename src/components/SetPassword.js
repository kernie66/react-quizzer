import PasswordStrengthBar from "react-password-strength-bar";
import InputField from "./InputField.js";
import { useTranslation } from "react-i18next";
import { Popover, PopoverBody, PopoverHeader, UncontrolledTooltip } from "reactstrap";
import zxcvbn from "zxcvbn";
import { useEffect, useState } from "react";
import getPasswordPopoverButtons from "../helpers/getPasswordPopoverButtons.js";

// const zxcvbn = lazy(() => import(zxcvbn));

const initialPasswordStrength = zxcvbn("");

export default function SetPassword({
  passwordValue,
  setPasswordValue,
  passwordError,
  setPasswordError,
  password2Value,
  setPassword2Value,
  password2Error,
  setPassword2Error,
  passwordField,
  password2Field,
  passwordUserInputs,
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [matchingPasswords, setMatchingPasswords] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState({});
  const [passwordWarning, setPasswordWarning] = useState();
  const [passwordWarningColor, setPasswordWarningColor] = useState();
  const [passwordSuggestion, setPasswordSuggestion] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(initialPasswordStrength);
  const [shortScoreWord, scoreWords] = getPasswordPopoverButtons();
  const { t } = useTranslation();

  const setPassword = (password) => {
    setPasswordValue(password);
    setPasswordError("");
  };

  const setPassword2 = (password2) => {
    setPassword2Value(password2);
    setPassword2Error("");
  };

  const setScore = (score, feedback) => {
    setPasswordScore(score);
    setPasswordFeedback(feedback);
  };

  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  // Check password score
  useEffect(() => {
    let tooltipText = t("enter-5-characters-for-hints");
    setPasswordWarningColor("text-white");
    if (passwordValue.length >= 5) {
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
  }),
    [passwordScore, passwordFeedback];

  // Check password strength
  useEffect(() => {
    const strengthData = zxcvbn(passwordValue, passwordUserInputs);
    console.log("Strength:", strengthData);
    console.log("Guesses:", new Intl.NumberFormat().format(strengthData.guesses));
    setPasswordStrength(strengthData);
  }, [passwordValue]);

  // Check password 2
  useEffect(() => {
    let passwordsError,
      passwordsMatch = "";
    if (password2Value) {
      if (password2Value === passwordValue) {
        passwordsMatch = "Passwords match";
      } else {
        passwordsError = t("the-passwords-doesnt-match");
      }
    }
    setPassword2Error(passwordsError);
    setMatchingPasswords(passwordsMatch);
  }, [passwordValue, password2Value]);

  return (
    <div>
      <InputField
        label={t("password")}
        name="password"
        type="password"
        fieldRef={passwordField}
        autoComplete="new-password"
        error={passwordError}
        onChange={setPassword}
      />
      <PasswordStrengthBar
        password={passwordValue}
        minLength={5}
        shortScoreWord={shortScoreWord}
        scoreWords={scoreWords}
        onChangeScore={setScore}
      />
      <InputField
        label={t("repeat-password")}
        name="password2"
        type="password"
        fieldRef={password2Field}
        isValid={matchingPasswords}
        error={password2Error}
        onBlur={setPassword2}
      />
      <Popover
        target="popoverButton"
        placement="top"
        trigger="legacy"
        isOpen={popoverOpen}
        toggle={togglePopover}
      >
        <PopoverHeader>{t("password-strength-info")}</PopoverHeader>
        <PopoverBody className="pt-1 px-1">
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
        </PopoverBody>
      </Popover>
      <UncontrolledTooltip target={passwordField} autohide={false}>
        {passwordWarning !== "" && <div className={passwordWarningColor}>{passwordWarning}</div>}
        {passwordSuggestion && (
          <div className="text-body">
            {passwordSuggestion.map((suggestion) => (
              <li key={suggestion.id}>{suggestion}</li>
            ))}
          </div>
        )}
      </UncontrolledTooltip>
    </div>
  );
}
