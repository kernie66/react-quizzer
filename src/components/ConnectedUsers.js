import { Badge, Divider, Group, Popover, ScrollArea, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { TbUserOff, TbUser, TbUsers } from "react-icons/tb";
import { FaHatWizard } from "react-icons/fa6";
import { useGetQuizzerQuery, useGetQuizzersQuery } from "../hooks/useQuizzersQuery.js";
import QuizzerAvatar from "./QuizzerAvatar.js";
import { useTranslation } from "react-i18next";
import { useEventSourceListener } from "react-sse-hooks";
import { useSetState } from "@mantine/hooks";
import { useSSE } from "../contexts/SSEProvider.js";
import { useUser } from "../contexts/UserProvider.js";

export default function ConnectedUsers() {
  const { t } = useTranslation();
  // const { quizzers } = useQuizzers();
  const noQuizMaster = t("no-quizmaster");
  const [numberOfQuizzers, setNumberOfQuizzers] = useState(0);
  const [quizzerIcon, setQuizzerIcon] = useState(<TbUserOff color="red" />);
  const [quizMasterIcon, setQuizMasterIcon] = useState(<FaHatWizard color="gray" />);
  const [quizMasterName, setQuizMasterName] = useState(noQuizMaster);
  const [quizzers, setQuizzers] = useSetState({ quizMaster: [], quizzers: [] });
  const { globalEventSource } = useSSE();
  const { user } = useUser();

  // eslint-disable-next-line no-unused-vars
  const { startListening, stopListening } = useEventSourceListener(
    {
      source: globalEventSource,
      startOnInit: true,
      event: {
        name: "quizzers",
        listener: ({ data }) => {
          if (data.quizzers) {
            setQuizzers({ quizzers: data.quizzers });
          }
          if (data.quizMaster) {
            setQuizzers({ quizMaster: data.quizMaster });
          }
        },
      },
    },
    [globalEventSource],
  );

  const {
    // isLoading: isLoadingQuizzers,
    // isError: isQuizzerError,
    data: quizzerNameArray,
  } = useGetQuizzersQuery(quizzers.quizzers); //useQuizzersQuery();

  useEffect(() => {
    let userIcon = <TbUserOff color="red" />;
    let wizardIcon = <FaHatWizard color="gray" />;
    let quizzerCount = 0;
    let quizMaster = noQuizMaster;
    let quizMasterId = 0;

    quizzerCount = quizzers.quizzers.length;
    if (quizzerCount === 1) {
      userIcon = <TbUser color="green" />;
    } else if (quizzerCount > 1) {
      userIcon = <TbUsers color="green" />;
    }
    if (quizzers.quizMaster.length === 1) {
      quizMasterId = quizzers.quizMaster[0];
      wizardIcon = <FaHatWizard color="green" />;
      quizMaster = useGetQuizzerQuery(quizMasterId);
    }
    setQuizzerIcon(userIcon);
    setQuizMasterIcon(wizardIcon);
    setNumberOfQuizzers(quizzerCount);
    setQuizMasterName(quizMaster);
  }, [quizzers]);

  useEffect(() => {
    // Remove info if not logged in
    if (!user) {
      setQuizzers({ quizMaster: [], quizzers: [] });
    }
  }, [user]);

  const setFW = (quizzer) => {
    if (quizzer.id === user.id) {
      return 600; // Quite bold
    }
    return 300; // Normal
  };

  return (
    <Group gap={8}>
      <Popover>
        <Popover.Target>
          <Group>{quizMasterIcon}</Group>
        </Popover.Target>
        <Popover.Dropdown>{quizMasterName}</Popover.Dropdown>
      </Popover>
      -
      <Popover>
        <Popover.Target>
          <Group gap={4}>
            {quizzerIcon}
            <Badge size="lg" circle>
              {numberOfQuizzers}
            </Badge>
          </Group>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="md">{t("quizzers")}</Text>
          <Divider mb={8} />
          <ScrollArea type="hover" mah="75vh" offsetScrollbars>
            {quizzerNameArray ? (
              quizzerNameArray.map((quizzer) => (
                <Group gap={4} ms={-6} mb={4} key={quizzer.id}>
                  <QuizzerAvatar user={quizzer} size={24} />
                  <Text fw={setFW(quizzer)}>{quizzer.name}</Text>
                </Group>
              ))
            ) : (
              <Text fs="italic">{t("no-quizzers")}</Text>
            )}
          </ScrollArea>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}
