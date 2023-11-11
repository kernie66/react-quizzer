import classes from "./css/userPage.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import Body from "../components/Body";
import EditUser from "../components/EditUser";
import { useApi } from "../contexts/ApiProvider";
import { useUser } from "../contexts/UserProvider";
import { useTranslation } from "react-i18next";
// import { useErrorBoundary } from "react-error-boundary";
import { useQuery } from "@tanstack/react-query";
import ChangeAvatar from "../components/ChangeAvatar.js";
import Quizzers from "../components/Quizzers.js";
import UserInfo from "../components/UserInfo.js";
import QuizzerAvatar from "../components/QuizzerAvatar.js";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { Button, Divider, Grid, Group, Loader, Stack, Text, Title } from "@mantine/core";
import QuizzerShell from "../components/QuizzerShell.js";

export default function UserPage() {
  const { id } = useParams();
  // const [user, setUser] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [avatarSize, setAvatarSize] = useState(128);
  const [openedAvatar, { open: openAvatar, close: closeAvatar }] = useDisclosure(false);
  const [openedUser, { open: openUser, close: closeUser }] = useDisclosure(false);
  const api = useApi();
  // const flash = useFlash();
  const { t } = useTranslation();
  const { user: loggedInUser } = useUser();
  const { width, height } = useViewportSize();
  //  const { showBoundary } = useErrorBoundary();

  const getUser = async (id) => {
    const response = await api.get("/users/" + id);
    if (response.ok) {
      if (response.data[0].id === loggedInUser.id || loggedInUser.isAdmin) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      return response.data[0];
    } else {
      // setUser(null);
      throw new Error("User not found");
    }
  };

  const {
    isLoading: isLoadingUser,
    data: user,
    refetch: refreshUser,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });

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

  return (
    <QuizzerShell>
      {isLoadingUser ? (
        <>
          <div className="text-secondary align-items-center">
            {t("looking-for-user")}
            <Loader color="blue" type="dots" />
          </div>
        </>
      ) : (
        <>
          {!user ? (
            <p>{t("user-not-found")}</p>
          ) : (
            <>
              <EditUser opened={openedUser} close={closeModal} user={user} />
              <ChangeAvatar opened={openedAvatar} close={closeModal} user={user} />
              <Grid>
                <Grid.Col span="content" maw="100%">
                  <QuizzerAvatar user={user} size={avatarSize} />
                </Grid.Col>
                <Grid.Col span="auto">
                  <Stack>
                    <Title order={2}>
                      {user.name}{" "}
                      {user.id === loggedInUser.id ? (
                        <span className={classes.me}>({t("me")})</span>
                      ) : null}{" "}
                      {user.isAdmin ? <span>&mdash;&nbsp;{t("administrator")}</span> : null}
                    </Title>
                    {user.aboutMe && (
                      <Text
                        size="xl"
                        fw={500}
                        my={8}
                        c="indigo.7"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {user.aboutMe}
                      </Text>
                    )}
                    <Grid>
                      <Grid.Col span="content">
                        <UserInfo user={user} />
                      </Grid.Col>
                      <Grid.Col span={2}>
                        Wins
                        <p>
                          Width: {width}, Height: {height}
                        </p>
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Grid.Col>
              </Grid>

              {loggedIn === true && (
                <Group mx={16}>
                  <Button variant="light" onClick={changeAvatar}>
                    {t("change-avatar")}
                  </Button>
                  <Button variant="light" onClick={editUser}>
                    {t("update")}
                  </Button>
                </Group>
              )}
              <Divider my={8} color="blue.6" size="sm" />
              <Quizzers currentId={user.id} />
            </>
          )}
        </>
      )}
    </QuizzerShell>
  );
}
