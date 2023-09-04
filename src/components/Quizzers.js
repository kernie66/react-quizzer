//import { useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "reactstrap";
import { useApi } from "../contexts/ApiProvider";
//import { useFlash } from "../contexts/FlashProvider";
//import More from "./More";
import Top from "./Top";
import { useQuery } from "@tanstack/react-query";
import Quizzer from "./Quizzer.js";
import { alphabetical, fork } from "radash";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function Quizzers({ currentId }) {
  // const [pagination, setPagination] = useState();
  const api = useApi();
  //  const flash = useFlash();

  const getQuizzers = async () => {
    const response = await api.get("/users");
    if (response.ok) {
      const quizzers = alphabetical(response.data, (item) => item.name);
      if (currentId) {
        const [, otherQuizzers] = fork(quizzers, (q) => q.id === currentId);
        return otherQuizzers;
      } else {
        return quizzers;
      }
    } else {
      // setUser(null);
      throw new Error("No quizzers found");
    }
  };

  const {
    isLoading: isLoadingQuizzers,
    isError: quizzerError,
    data: quizzers,
  } = useQuery({
    queryKey: ["quizzers"],
    queryFn: () => getQuizzers(),
  });

  /*
  let url;
  switch (content) {
    case "feed":
    case undefined:
      url = "/feed";
      break;
    case "explore":
      url = "/posts";
      break;
    default:
      url = `/users/${content}/posts`;
      break;
  }

  useEffect(() => {
    (async () => {
      const response = await api.get(url);
      if (response.ok) {
        setPosts(response.body.data);
        setPagination(response.body.pagination);
      } else {
        setPosts(null);
      }
    })();
  }, [api, url]);

  const showPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };
  const loadNextPage = async () => {
    flash("Posts are loaded...", "info", 2);
      const response = await api.get(url, {
      after: posts[posts.length - 1].timestamp,
    });
    if (response.ok) {
      setPosts([...posts, ...response.body.data]);
      setPagination(response.body.pagination);
    }
  };
  */

  return (
    <>
      {quizzerError ? (
        /*        flash('Could not retrieve blog posts from server', 'warning', 0) */
        <Alert color="warning">Could not retrieve quizzers</Alert>
      ) : (
        <>
          {isLoadingQuizzers ? (
            <>
              <Spinner animation="border" />
              <p>Getting data from {BASE_API_URL}</p>
            </>
          ) : (
            <>
              {quizzers.length === 0 ? (
                <p>There are no quizzers registered yet!</p>
              ) : (
                quizzers.map((quizzer) => <Quizzer key={quizzer.id} quizzer={quizzer} />)
              )}
              <Container>
                <Row>
                  <Col>
                    <Top />
                  </Col>
                  <Col></Col>
                </Row>
              </Container>
            </>
          )}
        </>
      )}
    </>
  );
}
