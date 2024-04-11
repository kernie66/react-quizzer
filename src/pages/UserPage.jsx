import classes from "./css/userPage.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditUser from "../components/EditUser";
import { useUser } from "../contexts/UserProvider";
import { useTranslation } from "react-i18next";
import ChangeAvatar from "../components/ChangeAvatar";
import Quizzers from "../components/Quizzers";
import UserInfo from "../components/UserInfo";
import QuizzerAvatar from "../components/QuizzerAvatar";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { Button, Divider, Group, Indicator, Loader, Stack, Text, Title } from "@mantine/core";
import { useGetQuizzerQuery } from "../hooks/useQuizzersQuery";
import setQuizzerOnlineColour from "../helpers/setQuizzerOnlineColour";
import { useQuizzers } from "../contexts/QuizzerProvider";

export default function UserPage() {
  const { id } = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [itsMe, setItsMe] = useState(false);
  const [avatarSize, setAvatarSize] = useState(128);
  const [openedAvatar, { open: openAvatar, close: closeAvatar }] = useDisclosure(false);
  const [openedUser, { open: openUser, close: closeUser }] = useDisclosure(false);
  const { t } = useTranslation();
  const { user: loggedInUser } = useUser();
  const { width } = useViewportSize();
  const { quizzers } = useQuizzers();

  const {
    isLoading: isLoadingUser,
    data: user,
    isError: isUserError,
    refetch: refreshUser,
  } = useGetQuizzerQuery(id);

  useEffect(() => {
    let isMe = false;
    let isLoggedIn = false;

    if (user?.id === loggedInUser.id) {
      isMe = true;
      isLoggedIn = true;
    } else if (loggedInUser.isAdmin) {
      isLoggedIn = true;
    }
    setItsMe(isMe);
    setLoggedIn(isLoggedIn);
  }, [user, loggedInUser]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    let size = 128;
    if (width < 1000) {
      size = Math.max((128 * width) / 1000, 64);
    }
    setAvatarSize(size);
  }, [width]);

  const editUser = () => {
    openUser();
    closeAvatar();
  };

  const changeAvatar = () => {
    openAvatar();
    closeUser();
  };

  const closeModal = () => {
    closeUser();
    closeAvatar();
    refreshUser();
  };

  if (isLoadingUser) {
    return (
      <Text>
        {t("looking-for-user")}
        <Loader color="blue" type="dots" />
      </Text>
    );
  }

  if (isUserError) {
    return <Text>{t("user-not-found")}</Text>;
  }

  const onlineStatus = () => {
    return setQuizzerOnlineColour(quizzers, user);
  };

  return (
    <>
      <EditUser opened={openedUser} close={closeModal} user={user} />
      <ChangeAvatar opened={openedAvatar} close={closeModal} user={user} />
      <Group align="start" mb="sm">
        <Indicator
          offset={avatarSize / 8}
          size={avatarSize / 4}
          color={onlineStatus()}
          withBorder
          processing={itsMe}
        >
          <QuizzerAvatar user={user} size={avatarSize} />
        </Indicator>
        <Stack gap="xs">
          <Title order={2}>
            {user.name}{" "}
            {user.id === loggedInUser.id ? <span className={classes.me}>({t("me")})</span> : null}{" "}
            {user.isAdmin ? <span>&mdash;&nbsp;{t("administrator")}</span> : null}
          </Title>
          {user.aboutMe && (
            <Text size="xl" fw={500} my={8} c="indigo.7" style={{ whiteSpace: "pre-wrap" }}>
              {user.aboutMe}
            </Text>
          )}
          <UserInfo user={user} />
        </Stack>
        <Text>Wins</Text>
      </Group>

      <Group mx={16}>
        <Button variant="light" disabled={!loggedIn} onClick={changeAvatar}>
          {t("change-avatar")}
        </Button>
        <Button variant="light" disabled={!loggedIn} onClick={editUser}>
          {t("update")}
        </Button>
      </Group>
      <Divider my={8} color="blue.6" size="sm" />
      <Quizzers currentId={user.id} />
    </>
  );
}
