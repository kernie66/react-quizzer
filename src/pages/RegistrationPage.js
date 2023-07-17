import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  PopoverBody,
  PopoverHeader,
  Row,
  Popover,
  UncontrolledTooltip,
} from "reactstrap";
import Body from "../components/Body";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import { useTranslation } from "react-i18next";
import getNameFromEmail from "../helpers/getNameFromEmail.js";
import PasswordStrengthBar from "react-password-strength-bar";
import zxcvbn from "zxcvbn";

export default function RegistrationPage() {
  const [modal, setModal] = useState(true);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordWarning, setPasswordWarning] = useState();
  const [passwordWarningColor, setPasswordWarningColor] = useState();
  const [passwordSuggestion, setPasswordSuggestion] = useState("");
  const [passwordStrength, setPasswordStrength] = useState([]);
  const usernameField = useRef();
  const emailField = useRef();
  const passwordField = useRef();
  const password2Field = useRef();
  const navigate = useNavigate();
  const api = useApi();
  const flash = useFlash();
  const { t } = useTranslation();

  const onOpened = () => {
    usernameField.current.focus();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const username = usernameField.current.value;
    const email = emailField.current.value;
    const password = passwordField.current.value;
    const password2 = password2Field.current.value;

    const errors = {};
    if (!username) {
      errors.username = t("please-select-a-username");
    } else {
      const existingUser = await api.get("/auth/check", { username });
      if (existingUser.status === 200) {
        errors.username = t("username-already-registered");
      }
    }
    if (!email) {
      errors.email = t("please-enter-a-valid-email-address");
    } else {
      const existingEmail = await api.get("/auth/check", { email });
      if (existingEmail.status === 200) {
        errors.email = t("email-address-already-registered-did-you-forget-your-password");
      }
    }
    if (!password) {
      errors.password = t("please-select-a-password");
    } else {
      if (passwordScore < 2) {
        errors.password = t("the-password-is-too-weak");
      }
    }
    if (!password2) {
      errors.password2 = t("please-repeat-the-password");
    } else {
      if (password !== password2) {
        errors.password2 = t("the-passwords-doesnt-match");
      }
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const name = getNameFromEmail(email);
    const data = await api.register({
      username: username,
      name: name,
      email: email,
      password: password,
    });
    if (!data.ok) {
      setFormErrors(data.errors.json);
    } else {
      setFormErrors({});
      setModal(false);
      flash(t("you-have-successfully-registered"), "success");
      navigate("/login");
    }
  };

  const checkUsername = (username) => {
    return username === "kenta" ? "The user is the best" : "";
  };

  const setPassword = (password) => {
    setPasswordValue(password);
    setFormErrors({});
    return "";
  };

  const checkPassword = () => {
    if (passwordScore < 2) {
      return "";
    }
    return " ";
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
  const checkPasswordStrength = () => {
    const username = usernameField.current.value;
    const email = emailField.current.value;
    const strengthData = zxcvbn(passwordValue, [username, email, "Saab"]);
    console.log("Strength:", strengthData);
    console.log("Guesses:", new Intl.NumberFormat().format(strengthData.guesses));
    setPasswordStrength(strengthData);
  };

  const cancel = () => {
    navigate("/login");
  };

  const short = (
    <Button id="popoverButton" outline size="sm" color="secondary" onClick={checkPasswordStrength}>
      {t("too-short")}
    </Button>
  );

  const veryWeak = (
    <Button id="popoverButton" outline size="sm" color="danger" onClick={checkPasswordStrength}>
      {t("very-weak")}
    </Button>
  );

  const weak = (
    <Button id="popoverButton" outline size="sm" color="danger" onClick={checkPasswordStrength}>
      {t("weak")}
    </Button>
  );

  const okay = (
    <Button id="popoverButton" outline size="sm" color="warning" onClick={checkPasswordStrength}>
      {t("okay")}
    </Button>
  );

  const good = (
    <Button id="popoverButton" outline size="sm" color="info" onClick={checkPasswordStrength}>
      {t("good")}
    </Button>
  );

  const strong = (
    <Button id="popoverButton" outline size="sm" color="success" onClick={checkPasswordStrength}>
      {t("strong")}
    </Button>
  );

  return (
    <Body>
      <Modal isOpen={modal} onOpened={onOpened} className="mt-0">
        <ModalHeader className="py-2">{t("user-registration")}</ModalHeader>
        <ModalBody className="pt-0">
          <Form onSubmit={onSubmit}>
            <InputField
              label={t("username")}
              name="username"
              fieldRef={usernameField}
              error={formErrors.username}
              onBlur={checkUsername}
            />
            <InputField
              label={t("email-address")}
              name="username"
              type="email"
              fieldRef={emailField}
              error={formErrors.email}
            />
            <InputField
              label={t("password")}
              name="password"
              type="password"
              fieldRef={passwordField}
              error={formErrors.password}
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
              error={formErrors.password2}
            />
            <Popover
              target="popoverButton"
              placement="top"
              trigger="legacy"
              isOpen={popoverOpen}
              toggle={togglePopover}
            >
              <PopoverHeader>Password strength info</PopoverHeader>
              <PopoverBody className="pt-1 px-1">
                <div>
                  <div className="mb-1">
                    <strong>Score: </strong>
                    {passwordStrength.score} (of 4)
                    <br />
                    <strong>Number of guesses: </strong>
                    {new Intl.NumberFormat().format(passwordStrength.guesses)}
                    <br />
                    <strong>Crack times:</strong>
                    <li>
                      Online throttling:{" "}
                      {passwordStrength.crack_times_display &&
                        passwordStrength.crack_times_display.online_throttling_100_per_hour}
                    </li>
                    <li>
                      Online no throttling:{" "}
                      {passwordStrength.crack_times_display &&
                        passwordStrength.crack_times_display.online_no_throttling_10_per_second}
                    </li>
                    <li>
                      Offline slow:{" "}
                      {passwordStrength.crack_times_display &&
                        passwordStrength.crack_times_display.offline_slow_hashing_1e4_per_second}
                    </li>
                    <li>
                      Offline fast:{" "}
                      {passwordStrength.crack_times_display &&
                        passwordStrength.crack_times_display.offline_fast_hashing_1e10_per_second}
                    </li>
                    <strong>Patterns:</strong>
                    {passwordStrength.sequence &&
                      passwordStrength.sequence.map((sequence) => (
                        <li key={sequence.id}>
                          <em>{sequence.pattern}</em>
                        </li>
                      ))}
                  </div>
                  <div className="border-top border-info">
                    <small>
                      Information provided by{" "}
                      <em>
                        <a
                          href="https://github.com/dropbox/zxcvbn"
                          target="_blank"
                          rel="noreferrer"
                        >
                          zxcvbn
                        </a>
                      </em>
                    </small>
                  </div>
                </div>
              </PopoverBody>
            </Popover>
            <UncontrolledTooltip target={passwordField} autohide={false}>
              {passwordWarning !== "" && (
                <div className={passwordWarningColor}>{passwordWarning}</div>
              )}
              {passwordSuggestion && (
                <div className="text-body">
                  {passwordSuggestion.map((suggestion) => (
                    <li key={suggestion.id}>{suggestion}</li>
                  ))}
                </div>
              )}
            </UncontrolledTooltip>
            <Row className="justify-content-between mb-2">
              <Col>
                <Button color="primary" className="submit me-auto">
                  {t("register")}
                </Button>
              </Col>
              <Col>
                <Button color="secondary" onClick={cancel} className="float-end">
                  {t("cancel")}
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Body>
  );
}
