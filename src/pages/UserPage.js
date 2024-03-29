import classes from "./css/userPage.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditUser from "../components/EditUser";
import { useUser } from "../contexts/UserProvider";
import { useTranslation } from "react-i18next";
import ChangeAvatar from "../components/ChangeAvatar.js";
import Quizzers from "../components/Quizzers.js";
import UserInfo from "../components/UserInfo.js";
import QuizzerAvatar from "../components/QuizzerAvatar.js";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { Button, Divider, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { useGetQuizzerQuery } from "../hooks/useQuizzersQuery.js";

export default function UserPage() {
  const { id } = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [avatarSize, setAvatarSize] = useState(128);
  const [openedAvatar, { open: openAvatar, close: closeAvatar }] = useDisclosure(false);
  const [openedUser, { open: openUser, close: closeUser }] = useDisclosure(false);
  const { t } = useTranslation();
  const { user: loggedInUser } = useUser();
  const { width } = useViewportSize();

  const {
    isLoading: isLoadingUser,
    data: user,
    isError: isUserError,
    refetch: refreshUser,
  } = useGetQuizzerQuery(id);

  useEffect(() => {
    if (user?.id === loggedInUser.id || loggedInUser.isAdmin) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
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

  return (
    <>
      <EditUser opened={openedUser} close={closeModal} user={user} />
      <ChangeAvatar opened={openedAvatar} close={closeModal} user={user} />
      <Group align="start" mb="sm">
        <QuizzerAvatar user={user} size={avatarSize} />
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
