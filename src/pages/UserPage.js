import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Col, Container, Media, Row, Spinner } from "reactstrap";
import Body from "../components/Body";
import EditUser from "../components/EditUser";
import TimeAgo from "../components/TimeAgo";
import { useApi } from "../contexts/ApiProvider";
// import { useFlash } from "../contexts/FlashProvider";
import { useUser } from "../contexts/UserProvider";
import { useTranslation } from "react-i18next";
// import { useErrorBoundary } from "react-error-boundary";
import { useQuery } from "@tanstack/react-query";
import ChangeAvatar from "../components/ChangeAvatar.js";
import Quizzers from "../components/Quizzers.js";

export default function UserPage() {
  const { id } = useParams();
  // const [user, setUser] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const api = useApi();
  // const flash = useFlash();
  const { t } = useTranslation();
  const { user: loggedInUser } = useUser();
  //  const { showBoundary } = useErrorBoundary();

  const imgStyle = {
    maxWidth: "100%",
    maxHeight: "auto",
  };

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

  const { isLoading: isLoadingUser, data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const editUser = () => {
    setEditModal(true);
    setAvatarModal(false);
  };

  const changeAvatar = () => {
    setEditModal(false);
    setAvatarModal(true);
  };

  const closeModal = () => {
    setEditModal(false);
    setAvatarModal(false);
  };

  /*
  const follow = async () => {
    const response = await api.post("/me/following/" + user.id);
    if (response.ok) {
      flash(
        <>
          You are now following <b>{user.username}</b>.
        </>,
        "success",
        5,
      );
    }
  };
  */

  return (
    <Body sidebar>
      {isLoadingUser ? (
        <>
          <div className="text-secondary">
            {t("looking-for-user")}
            <Spinner animation="border" />
          </div>
        </>
      ) : (
        <>
          {!user ? (
            <p>{t("user-not-found")}</p>
          ) : (
            <>
              <EditUser modal={editModal} closeModal={closeModal} />
              <ChangeAvatar modal={avatarModal} closeModal={closeModal} />
              <Container className="UserPage px-1">
                <Row className="border-bottom mb-2">
                  <Col xs="2" className="Avatar128 ps-0 pe-1 me-0">
                    <Media
                      src={user.avatar_url + "&s=128"}
                      className="rounded-circle"
                      style={imgStyle}
                    />
                  </Col>
                  <Col>
                    <h3 className="text-primary">{user.name}</h3>
                    {user.about_me && <h5>{user.about_me}</h5>}
                    <ul className="list-unstyled">
                      <li>
                        {t("quizzer-since")} <TimeAgo isoDate={user.createdAt} />
                      </li>
                      <li>
                        {t("last-login")} <TimeAgo isoDate={user.lastSeen} />
                      </li>
                    </ul>
                    {loggedIn === true && (
                      <Button color="info" onClick={editUser} className="mb-2 me-2 p-1">
                        {t("update")}
                      </Button>
                    )}
                    {loggedIn === true && (
                      <Button color="info" onClick={changeAvatar} className="mb-2 me-2 p-1">
                        {t("change-avatar")}
                      </Button>
                    )}
                  </Col>
                </Row>
                <Quizzers currentId={user.id} />
              </Container>
            </>
          )}
        </>
      )}
    </Body>
  );
}
