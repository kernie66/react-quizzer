// import { Button, Form, Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useApi } from "../contexts/ApiProvider";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { useTranslation } from "react-i18next";
import { Button, Divider, Flex, Modal, Select, Text, rem } from "@mantine/core";
import QuizzerAvatar from "./QuizzerAvatar.js";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export default function ChangeAvatar({ user, opened, close }) {
  const api = useApi();
  const [userData, setUserData] = useImmer(user); // useState(user);
  const [avatarType, setAvatarType] = useState(user.avatarType);
  const { t } = useTranslation();

  const avatarTypes = [
    { value: "wavatar", label: t("generated-face") },
    { value: "monsterid", label: t("generated-monster") },
    { value: "robohash", label: t("generated-robot") },
    { value: "identicon", label: t("geometric-pattern") },
    { value: "retro", label: t("8-bit-arcade-style-pixelated-face") },
  ];

  const url = user.avatarUrl.split("d=")[0];

  useEffect(() => {
    setUserData(user);
  }, [user]);

  useEffect(() => {
    const newUrl = url + `d=${avatarType}`;
    setUserData((draft) => {
      draft.avatarType = avatarType;
      draft.avatarUrl = newUrl;
    });
  }, [avatarType]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (user.avatarType != userData.avatarType) {
      const response = await api.put("/users/" + user.id, { avatarType: userData.avatarType });
      if (response.ok) {
        showNotification({
          title: userData.name,
          message: t("profile-has-been-updated"),
          color: "green",
          icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
          autoClose: 4000,
        });
      } else {
        showNotification({
          title: userData.name,
          message: t("the-profile-could-not-be-updated"),
          color: "red",
          icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        });
      }
    } else {
      showNotification({
        title: userData.name,
        message: t("the-profile-was-not-changed"),
        color: "blue",
      });
    }
    close();
  };

  return (
    <Modal opened={opened} onClose={close} centered title={<h5>{t("change-avatar")}</h5>}>
      <Divider mb={8} />
      <Flex gap="md">
        <QuizzerAvatar user={userData} size={64} />
        <Text mx={8} c="blue">
          {t(
            "try-the-different-avatar-types-below-or-define-your-own-free-avatar-based-on-your-email-at",
          )}
          &nbsp;
          <em>
            <a href="https://en.gravatar.com" target="_blank" rel="noreferrer">
              Gravatar
            </a>
          </em>
        </Text>
      </Flex>
      <Select
        size="md"
        label={t("select-your-preferred-avatar")}
        data-autofocus
        checkIconPosition="right"
        data={avatarTypes}
        value={avatarType}
        allowDeselect={false}
        onChange={setAvatarType}
        my={16}
      />
      <Divider />
      <Button my={8} onClick={onSubmit}>
        {t("update")}
      </Button>
    </Modal>
  );
}
