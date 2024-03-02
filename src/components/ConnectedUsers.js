import { Badge, Group, Popover, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { TbUserOff, TbUser, TbUsers } from "react-icons/tb";
import { FaHatWizard } from "react-icons/fa6";
import { useGetQuizzerQuery, useGetQuizzersQuery } from "../hooks/useQuizzersQuery.js";
import i18next from "i18next";

const noQuizMaster = i18next.t("no-quizmaster");

export default function ConnectedUsers({ quizzers }) {
  const [numberOfQuizzers, setNumberOfQuizzers] = useState(0);
  const [quizzerIcon, setQuizzerIcon] = useState(<TbUserOff color="red" />);
  const [quizMasterIcon, setQuizMasterIcon] = useState(<FaHatWizard color="gray" />);
  const [quizMasterName, setQuizMasterName] = useState(noQuizMaster);

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

  if (quizzerNameArray) {
    console.log("Quizzers for tooltip:", quizzerNameArray.id);
  }

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
          {quizzerNameArray
            ? quizzerNameArray?.map((quizzer) => <Text key={quizzer.id}>quizzer.name</Text>)
            : null}
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}
