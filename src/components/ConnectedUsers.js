import { Badge, Divider, Group, Popover, ScrollArea, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { TbUserOff, TbUser, TbUsers } from "react-icons/tb";
import { FaHatWizard } from "react-icons/fa6";
import { useGetQuizzerQuery, useGetQuizzersQuery } from "../hooks/useQuizzersQuery.js";
import QuizzerAvatar from "./QuizzerAvatar.js";
import { useTranslation } from "react-i18next";
import { useUser } from "../contexts/UserProvider.js";
import { useQuizzers } from "../contexts/QuizzerProvider.js";

export default function ConnectedUsers() {
  const { t } = useTranslation();
  // const noQuizMaster = t("no-quizmaster");
  const [numberOfQuizzers, setNumberOfQuizzers] = useState(0);
  const [quizzerIcon, setQuizzerIcon] = useState(<TbUserOff color="red" />);
  const [quizMasterIcon, setQuizMasterIcon] = useState(<FaHatWizard color="gray" />);
  const [quizMasterName, setQuizMasterName] = useState("");
  const { user } = useUser();
  const { quizzers } = useQuizzers();

  const {
    // isLoading: isLoadingQuizzers,
    // isError: isQuizzerError,
    data: quizzerNameArray,
  } = useGetQuizzersQuery(quizzers.quizzers); //useQuizzersQuery();

  const {
    // isLoading: isLoadingQuizzers,
    // isError: isQuizzerError,
    data: quizMasterData,
  } = useGetQuizzerQuery(quizzers.quizMaster[0]); //useQuizzersQuery();

  useEffect(() => {
    let userIcon = <TbUserOff color="red" />;
    let wizardIcon = <FaHatWizard color="gray" />;
    let quizzerCount = 0;
    let quizMaster = "";

    quizzerCount = quizzers.quizzers.length;
    if (quizzerCount === 1) {
      userIcon = <TbUser color="green" />;
    } else if (quizzerCount > 1) {
      userIcon = <TbUsers color="green" />;
    }
    if (quizzers.quizMaster.length === 1) {
      wizardIcon = <FaHatWizard color="green" />;
      console.log("quizMasterData", quizMasterData);
      quizMaster = quizMasterData.name;
    }
    setQuizzerIcon(userIcon);
    setQuizMasterIcon(wizardIcon);
    setNumberOfQuizzers(quizzerCount);
    setQuizMasterName(quizMaster);
    console.log("quizMaster", quizMaster);
  }, [quizzers]);

  // Set font weight
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
        <Popover.Dropdown>
          <Text size="md">QuizMaster</Text>
          <Divider mb={8} />
          {quizMasterName ? (
            <Group gap={4} ms={-6} mb={4}>
              <QuizzerAvatar user={quizMasterData.id} size={24} />
              <Text>{quizMasterName}</Text>
            </Group>
          ) : (
            <Text fs="italic">{t("no-quizmaster")}</Text>
          )}
        </Popover.Dropdown>
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
