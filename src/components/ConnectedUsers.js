import { Badge, Group, Popover } from "@mantine/core";
import { useEffect, useState } from "react";
import { TbUserOff, TbUser, TbUsers } from "react-icons/tb";
import { FaHatWizard } from "react-icons/fa6";

export default function ConnectedUsers({ clients }) {
  const [quizzerIcon, setQuizzerIcon] = useState(<TbUserOff color="red" />);
  const [quizMasterIcon, setQuizMasterIcon] = useState(<FaHatWizard color="gray" />);
  useEffect(() => {
    let newIcon = <TbUserOff color="red" />;
    if (clients) {
      if (clients === 1) {
        newIcon = <TbUser color="green" />;
      } else {
        newIcon = <TbUsers color="green" />;
      }
    }
    setQuizzerIcon(newIcon);
    setQuizMasterIcon(<FaHatWizard color="green" />);
  }, [clients]);

  return (
    <Group gap={8}>
      <Popover>
        <Popover.Target>{quizMasterIcon}</Popover.Target>
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
