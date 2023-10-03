import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Body from "../components/Body";
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
import { Button, Divider, Grid, Group, Loader, Stack } from "@mantine/core";

export default function UserPage() {
  const { id } = useParams();
  // const [user, setUser] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [avatarSize, setAvatarSize] = useState(128);
  const [openedAvatar, { open: openAvatar, close: closeAvatar }] = useDisclosure(false);
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
    setEditModal(true);
    closeAvatar();
  };

  const changeAvatar = () => {
    setEditModal(false);
    openAvatar();
  };

  const closeModal = () => {
    setEditModal(false);
    closeAvatar();
    refreshUser();
  };

  return (
    <Body>
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
              <EditUser modal={editModal} closeModal={closeModal} user={user} />
              <ChangeAvatar opened={openedAvatar} close={closeModal} user={user} />
              <Grid>
                <Grid.Col span="content" maw="100%">
                  <QuizzerAvatar user={user} size={avatarSize} />
                </Grid.Col>
                <Grid.Col span="auto">
                  <Stack>
                    <h3 className="text-info-emphasis">
                      {user.name}{" "}
                      {user.id === loggedInUser.id ? (
                        <span className="text-primary">({t("me")})</span>
                      ) : null}{" "}
                      {user.isAdmin ? <span>&mdash;&nbsp;{t("administrator")}</span> : null}
                    </h3>
                    {user.aboutMe && (
                      <h5 className="text-info" style={{ whiteSpace: "pre-wrap" }}>
                        {user.aboutMe}
                      </h5>
                    )}
                    <p>
                      Width: {width}, Height: {height}
                    </p>
                    <Grid>
                      <Grid.Col span="content">
                        <UserInfo user={user} />
                      </Grid.Col>
                      <Grid.Col span={2}>Wins</Grid.Col>
                    </Grid>
                  </Stack>
                </Grid.Col>
              </Grid>

              {loggedIn === true && (
                <Group>
                  <Button onClick={changeAvatar}>{t("change-avatar")}</Button>
                  <Button onClick={editUser}>{t("update")}</Button>
                </Group>
              )}
              <Divider my={8} />
              <Quizzers currentId={user.id} />
            </>
          )}
        </>
      )}
    </Body>
  );
}
