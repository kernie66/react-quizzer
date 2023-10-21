// const zxcvbn = lazy(() => import(zxcvbn));
import { useTranslation } from "react-i18next";
import { useDisclosure, useShallowEffect } from "@mantine/hooks";
// import { useState } from "react";
import { Button, Popover, ScrollArea, Text } from "@mantine/core";
import getPasswordStrength from "../helpers/getPasswordStrength.js";
import PasswordStrengthBar from "./PasswordStrengthBar.js";
import { useQuery } from "@tanstack/react-query";
import bigNumbersToText from "../helpers/bigNumbersToText.js";

export default function PasswordStrength({ password, passwordUserInputs }) {
  const [popoverOpened, { toggle: popoverToggle }] = useDisclosure(false);
  // const [passwordStrength, setPasswordStrength] = useSetState({ score: 0 });
  // const [passwordScore, setPasswordScore] = useState(0);
  // const [passwordFeedback, setPasswordFeedback] = useState({});
  const { t } = useTranslation();

  useShallowEffect(() => {
    (async () => {
      // const strengthData = await usePasswordStrength(password, passwordUserInputs);
      //setPasswordStrength(passwordStrengthQuery);
      console.log("Strength data:", password);
    })();
  }, [password]);

  const {
    isLoading: isLoadingQuery,
    isError,
    data: passwordStrength,
    error,
  } = useQuery({
    queryKey: ["strength", { password: password, userInputs: passwordUserInputs }],
    queryFn: () => getPasswordStrength(password, passwordUserInputs),
    staleTime: 1000 * 60 * 5,
  });
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

  if (isLoadingQuery) {
    return (
      <Button variant="outline" size="sm" disabled mt={8} loading>
        {t("info")}
      </Button>
    );
  }

  if (isError) {
    console.log("Loading complete:", error.message);
    return (
      <Button variant="outline" size="sm" disabled mt={8}>
        {t("info")}
      </Button>
    );
  }

  return (
    <Popover opened={popoverOpened} position="top-center">
      <PasswordStrengthBar strength={passwordStrength.score} />
      <Popover.Target>
        <Button variant="outline" size="sm" onClick={popoverToggle} mt={8}>
          {t("info")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <div>
          <div className="mb-1">
            <Text mb="xs">
              <Text fw={600} span>
                {t("score")}
              </Text>
              {": "}
              {passwordStrength.score} {t("of-4")}
            </Text>
            {passwordStrength.guesses > 0 && (
              <ScrollArea.Autosize type="auto" mah={200} offsetScrollbars>
                <Text>
                  <Text span fw={700}>
                    {t("number-of-guesses")}{" "}
                  </Text>
                  {bigNumbersToText(passwordStrength.guesses)}
                </Text>
                {passwordStrength.crackTimesDisplay && (
                  <div>
                    <strong>{t("crack-times")}</strong>
                    <li key="online_throttling">
                      <em>Online throttling:</em>{" "}
                      {t(
                        `timeEstimation.${passwordStrength.crackTimesDisplay.onlineThrottling100PerHour}`,
                      )}
                    </li>
                    <li key="online_no_throttling">
                      <em>Online no throttling:</em>{" "}
                      {t(
                        `timeEstimation.${passwordStrength.crackTimesDisplay.onlineNoThrottling10PerSecond}`,
                      )}
                    </li>
                    <li key="offline_slow">
                      <em>Offline slow:</em>{" "}
                      {t(
                        `timeEstimation.${passwordStrength.crackTimesDisplay.offlineSlowHashing1e4PerSecond}`,
                      )}
                    </li>
                    <li key="offline_fast">
                      <em>Offline fast:</em>{" "}
                      {t(
                        `timeEstimation.${passwordStrength.crackTimesDisplay.offlineFastHashing1e10PerSecond}`,
                      )}
                    </li>
                  </div>
                )}
                {passwordStrength.sequence.length !== 0 && (
                  <div>
                    <strong>Patterns:</strong>
                    {passwordStrength.sequence.map((sequence, index) => (
                      <li key={index}>
                        <em>{sequence.pattern}</em> ({sequence.token})
                      </li>
                    ))}
                  </div>
                )}
              </ScrollArea.Autosize>
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
