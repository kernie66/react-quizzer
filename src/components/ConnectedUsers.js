import { Badge, Group, Popover } from "@mantine/core";
import { useEffect, useState } from "react";
import { TbUserOff, TbUser, TbUsers } from "react-icons/tb";
import { FaHatWizard } from "react-icons/fa6";

export default function ConnectedUsers({ quizzers }) {
  const [numberOfQuizzers, setNumberOfQuizzers] = useState(0);
  const [quizzerIcon, setQuizzerIcon] = useState(<TbUserOff color="red" />);
  const [quizMasterIcon, setQuizMasterIcon] = useState(<FaHatWizard color="gray" />);

  useEffect(() => {
    let userIcon = <TbUserOff color="red" />;
    let wizardIcon = <FaHatWizard color="gray" />;
    let quizzerCount = 0;
    console.log("Quizzers:", quizzers.quizzers);
    if (quizzers) {
      quizzerCount = quizzers.quizzers.length;
      if (quizzerCount === 1) {
        userIcon = <TbUser color="green" />;
      } else {
        userIcon = <TbUsers color="green" />;
      }
    }
    if (quizzers.quizMaster.length === 1) {
      wizardIcon = <FaHatWizard color="green" />;
    }

    setQuizzerIcon(userIcon);
    setQuizMasterIcon(wizardIcon);
    setNumberOfQuizzers(quizzerCount);
  }, [quizzers]);

  return (
    <Group gap={8}>
      <Popover>
        <Popover.Target>
          <Group>{quizMasterIcon}</Group>
        </Popover.Target>
        <Popover.Dropdown>No QuizMaster</Popover.Dropdown>
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
        <Popover.Dropdown>Text</Popover.Dropdown>
      </Popover>
    </Group>
  );
}
