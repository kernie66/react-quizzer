import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Col, Container, Row, Spinner } from "reactstrap";
import Body from "../components/Body";
import EditUser from "../components/EditUser";
import { useApi } from "../contexts/ApiProvider";
// import { useFlash } from "../contexts/FlashProvider";
import { useUser } from "../contexts/UserProvider";
import { useTranslation } from "react-i18next";
// import { useErrorBoundary } from "react-error-boundary";
import { useQuery } from "@tanstack/react-query";
import ChangeAvatar from "../components/ChangeAvatar.js";
import Quizzers from "../components/Quizzers.js";
import ShowWindowSize from "../components/ShowWindowSize.js";
import Avatar from "../components/Avatar.js";
import UserInfo from "../components/UserInfo.js";

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

  return (
    <Body sidebar>
      {isLoadingUser ? (
        <>
          <div className="text-secondary align-items-center">
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
              <EditUser modal={editModal} closeModal={closeModal} user={user} />
              <ChangeAvatar modal={avatarModal} closeModal={closeModal} user={user} />
              <Container fluid className="UserPage px-1">
                <Row className="mb-2">
                  <Col xs="2" className="Avatar128">
                    <Avatar user={user} size={128} />
                  </Col>
                  <Col xs="8">
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
                    <Row>
                      <Col>
                        <UserInfo user={user} />
                      </Col>
                      <Col>Number of wins</Col>
                    </Row>
                  </Col>
                  <Col>{loggedInUser.isAdmin && <ShowWindowSize />}</Col>
                  <Row className="border-bottom border-primary mb-2">
                    <Col>
                      {loggedIn === true && (
                        <>
                          <Button color="info" onClick={changeAvatar} className="mb-2 me-2 p-1">
                            {t("change-avatar")}
                          </Button>
                          <Button color="info" onClick={editUser} className="mb-2 me-2 p-1">
                            {t("update")}
                          </Button>
                        </>
                      )}
                    </Col>
                  </Row>
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
