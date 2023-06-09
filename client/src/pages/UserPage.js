import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Col, Container, Media, Row, Spinner } from "reactstrap";
import Body from "../components/Body";
import EditUser from "../components/EditUser";
import Posts from "../components/Posts";
import TimeAgo from "../components/TimeAgo";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import { useUser } from "../contexts/UserProvider";

export default function UserPage() {
  const { username } = useParams();
  const [user, setUser] = useState();
  const [isFollower, setIsFollower] = useState();
  const [modal, setModal] = useState(false);
  const api = useApi();
  const flash = useFlash();
  const { user: loggedInUser } = useUser();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    (async () => {
      const response = await api.get("/users?username=" + username);
      if (response.ok) {
        setUser(response.data[0]);
        if (response.data[0].username !== loggedInUser.username) {
          /* const follower = await api.get('/me/following/' + response.body.id);
          if (follower.status === 204) {
            setIsFollower(true);
          }
          else if (follower.status === 404) {
            setIsFollower(false);
          }*/
        } else {
          setIsFollower(null);
        }
      } else {
        setUser(null);
      }
    })();
  }, [username, api, loggedInUser]);

  const editUser = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

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
      setIsFollower(true);
    }
  };

  const unfollow = async () => {
    const response = await api.delete("/me/following/" + user.id);
    if (response.ok) {
      flash(
        <>
          You have unfollowed <b>{user.username}</b>.
        </>,
        "success",
        5,
      );
      setIsFollower(false);
    }
  };
  return (
    <Body sidebar>
      {user === undefined ? (
        <Spinner animation="border" />
      ) : (
        <>
          {user === null ? (
            <p>User not found</p>
          ) : (
            <>
              <EditUser modal={modal} closeModal={closeModal} />
              <Container className="UserPage">
                <Row className="border-bottom mb-2">
                  <Col xs="2" className="Avatar128">
                    <Media src={user.avatar_url + "&s=128"} className="rounded-circle" />
                    <Media src="/test.jpeg" />
                  </Col>
                  <Col>
                    <h1 className="text-info">{user.name}</h1>
                    {user.about_me && <h5>{user.about_me}</h5>}
                    <ul>
                      <li>
                        Member since: <TimeAgo isoDate={user.createdAt} />
                      </li>
                      <li>
                        Last seen: <TimeAgo isoDate={user.lastSeen} />
                      </li>
                    </ul>
                    {isFollower === null && (
                      <Button color="primary" onClick={editUser} className="mb-2">
                        Edit
                      </Button>
                    )}
                    {isFollower === true && (
                      <Button color="primary" onClick={unfollow} className="mb-2">
                        Unfollow
                      </Button>
                    )}
                    {isFollower === false && (
                      <Button color="primary" onClick={follow} className="mb-2">
                        Follow
                      </Button>
                    )}
                  </Col>
                </Row>
                <Posts content={user.id} />
              </Container>
            </>
          )}
        </>
      )}
    </Body>
  );
}
