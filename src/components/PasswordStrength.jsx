import { Button, Divider, List, Popover, ScrollArea, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import bigNumbersToText from "../helpers/bigNumbersToText";
import getPasswordStrength from "../helpers/getPasswordStrength";

export default function PasswordStrength({ password, passwordUserInputs }) {
  const [popoverOpened, { toggle: popoverToggle }] = useDisclosure(false);
  const { t } = useTranslation();

  const {
    isLoading: isLoadingQuery,
    isError,
    data: passwordStrength,
    error,
  } = useQuery({
    queryKey: ["strength", { password: password, userInputs: passwordUserInputs }],
    queryFn: () => getPasswordStrength(password, passwordUserInputs),
    placeholderData: { score: 0, guesses: 0 },
    staleTime: 1000,
    gcTime: 1000,
  });

  if (isError) {
    console.log("Loading complete:", error.message);
    return (
      <Button variant="outline" size="sm" disabled mx={8} w={"4rem"}>
        {t("info")}
      </Button>
    );
  }

  return (
    <Popover opened={popoverOpened} position="top-center">
      <Popover.Target>
        <Button
          variant="outline"
          size="sm"
          onClick={popoverToggle}
          mx={8}
          w={"4rem"}
          className="PasswordStrength"
          loading={isLoadingQuery}
        >
          {t("info")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
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
              <List>
                <Text fw={700}>{t("crack-times")}</Text>
                <List.Item key="online_throttling">
                  <Text>
                    <Text span fs="italic">
                      Online throttling:
                    </Text>{" "}
                    {t(
                      `timeEstimation.${passwordStrength.crackTimesDisplay.onlineThrottling100PerHour}`,
                    )}
                  </Text>
                </List.Item>
                <List.Item key="online_no_throttling">
                  <Text>
                    <Text span fs="italic">
                      Online no throttling:
                    </Text>{" "}
                    {t(
                      `timeEstimation.${passwordStrength.crackTimesDisplay.onlineNoThrottling10PerSecond}`,
                    )}
                  </Text>
                </List.Item>
                <List.Item key="offline_slow">
                  <Text>
                    <Text span fs="italic">
                      Offline slow:
                    </Text>{" "}
                    {t(
                      `timeEstimation.${passwordStrength.crackTimesDisplay.offlineSlowHashing1e4PerSecond}`,
                    )}
                  </Text>
                </List.Item>
                <List.Item key="offline_fast">
                  <Text>
                    <Text span fs="italic">
                      Offline fast:
                    </Text>{" "}
                    {t(
                      `timeEstimation.${passwordStrength.crackTimesDisplay.offlineFastHashing1e10PerSecond}`,
                    )}
                  </Text>
                </List.Item>
              </List>
            )}
            {passwordStrength.sequence.length !== 0 && (
              <List>
                <Text fw={700}>{t("patterns")}:</Text>
                {passwordStrength.sequence.map((sequence, index) => (
                  <List.Item key={index}>
                    <Text>
                      <Text span fs="italic">
                        {sequence.pattern}
                      </Text>{" "}
                      ({sequence.token})
                    </Text>
                  </List.Item>
                ))}
              </List>
            )}
          </ScrollArea.Autosize>
        )}
        <Divider />
        <Text size="sm" c="blue">
          {t("information-provided-by")}{" "}
          <Text span fs="italic">
            <a href="https://github.com/dropbox/zxcvbn" target="_blank" rel="noreferrer">
              zxcvbn
            </a>
          </Text>
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
}
