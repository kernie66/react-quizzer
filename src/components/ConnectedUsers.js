import { Badge, Group, Popover } from "@mantine/core";
import { useEffect, useState } from "react";
import { TbUserOff, TbUser, TbUsers } from "react-icons/tb";
import { FaHatWizard } from "react-icons/fa6";

export default function ConnectedUsers({ clients }) {
  const [quizzerIcon, setQuizzerIcon] = useState(<TbUserOff color="red" />);
  const [quizMasterIcon, setQuizMasterIcon] = useState(<FaHatWizard color="gray" />);
  useEffect(() => {
    let userIcon = <TbUserOff color="red" />;
    let wizardIcon = <FaHatWizard color="gray" />;
    if (clients) {
      if (Number(clients) === 1) {
        userIcon = <TbUser color="green" />;
        wizardIcon = <FaHatWizard color="green" />;
      } else {
        userIcon = <TbUsers color="green" />;
      }
    }
    console.log("Clients:", clients, userIcon.type.name);
    setQuizzerIcon(userIcon);
    setQuizMasterIcon(wizardIcon);
  }, [clients]);

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
              {clients}
            </Badge>
          </Group>
        </Popover.Target>
        <Popover.Dropdown>Text</Popover.Dropdown>
      </Popover>
    </Group>
  );
}
