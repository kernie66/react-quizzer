import PasswordStrengthBar from "react-password-strength-bar";
import InputField from "./InputField.js";
import { useTranslation } from "react-i18next";
import { Button, Popover, PopoverBody, PopoverHeader, UncontrolledTooltip } from "reactstrap";
import zxcvbn from "zxcvbn";
import { useEffect, useState } from "react";

const initialPasswordStrength = zxcvbn("");

export default function SetPassword({
  passwordValue,
  setPasswordValue,
  passwordError,
  setPasswordError,
  passwordField,
  password2Field,
  passwordUserInputs,
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [password2Value, setPassword2Value] = useState();
  const [password2Error, setPassword2Error] = useState();
  const [matchingPasswords, setMatchingPasswords] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordWarning, setPasswordWarning] = useState();
  const [passwordWarningColor, setPasswordWarningColor] = useState();
  const [passwordSuggestion, setPasswordSuggestion] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(initialPasswordStrength);
  const { t } = useTranslation();

  const setPassword = (password) => {
    setPasswordValue(password);
    //    setFormErrors({});
  };

  const setPassword2 = (password2) => {
    setPassword2Value(password2);
  };

  const checkPassword = () => {
    if (passwordScore >= 2) {
      return true;
    } else {
      setPasswordError("Bad password");
    }
  };

  const checkScore = (score, feedback) => {
    let tooltipText = t("enter-5-characters-for-hints");
    setPasswordWarningColor("text-white");
    console.log(score, feedback, passwordValue.length);
    setPasswordScore(score);
    if (passwordValue.length >= 5) {
      tooltipText = t("password-is-not-good-enough");
      if (feedback.warning) {
        tooltipText = "Warning: " + feedback.warning;
        setPasswordWarningColor("text-warning");
      } else if (score === 3) {
        tooltipText = t("password-strength-is-sufficient");
      } else if (score === 4) {
        tooltipText = t("password-strength-is-very-good");
      }
    }
    setPasswordWarning(tooltipText);
    if (feedback.suggestions) {
      setPasswordSuggestion(feedback.suggestions);
    } else {
      setPasswordSuggestion("");
    }
  };

  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  // Check password strength
  useEffect(() => {
    const strengthData = zxcvbn(passwordValue, passwordUserInputs);
    console.log("Strength:", strengthData);
    console.log("Guesses:", new Intl.NumberFormat().format(strengthData.guesses));
    setPasswordStrength(strengthData);
  }, [passwordValue]);

  // Check password 2
  useEffect(() => {
    let passwordsMatch = "";
    if (password2Value) {
      if (password2Value === passwordValue) {
        passwordsMatch = "Passwords match";
      } else {
        setPassword2Error(t("the-passwords-doesnt-match"));
      }
    }
    setMatchingPasswords(passwordsMatch);
  }, [passwordValue, password2Value]);

  const noAction = (event) => {
    event.preventDefault();
  };

  const short = (
    <Button id="popoverButton" outline size="sm" color="secondary" onClick={noAction}>
      {t("too-short")}
    </Button>
  );

  const veryWeak = (
    <Button id="popoverButton" outline size="sm" color="danger" onClick={noAction}>
      {t("very-weak")}
    </Button>
  );

  const weak = (
    <Button id="popoverButton" outline size="sm" color="danger" onClick={noAction}>
      {t("weak")}
    </Button>
  );

  const okay = (
    <Button id="popoverButton" outline size="sm" color="warning" onClick={noAction}>
      {t("okay")}
    </Button>
  );

  const good = (
    <Button id="popoverButton" outline size="sm" color="info" onClick={noAction}>
      {t("good")}
    </Button>
  );

  const strong = (
    <Button id="popoverButton" outline size="sm" color="success" onClick={noAction}>
      {t("strong")}
    </Button>
  );

  return (
    <div>
      <InputField
        label={t("password")}
        name="password"
        type="password"
        fieldRef={passwordField}
        error={passwordError}
        autoComplete="new-password"
        onChange={setPassword}
        onBlur={checkPassword}
      />
      <PasswordStrengthBar
        password={passwordValue}
        minLength={5}
        shortScoreWord={short}
        scoreWords={[veryWeak, weak, okay, good, strong]}
        onChangeScore={checkScore}
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
