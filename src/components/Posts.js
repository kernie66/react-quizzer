import { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "reactstrap";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import More from "./More";
import Post from "./Post";
import Top from "./Top";
import Write from "./Write";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function Posts({ content, write }) {
  const [posts, setPosts] = useState();
  const [pagination, setPagination] = useState();
  const api = useApi();
  const flash = useFlash();

  let url;
  switch (content) {
    case 'feed':
    case undefined:
      url = '/feed';
      break;
    case 'explore':
      url = '/posts';
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
      }
      else {
        setPosts(null);
      }
    })();  /* Execute the function */
  }, [api, url]);  /* Second parameter is the dependencies */

  const showPost = (newPost) => {
    setPosts([newPost, ...posts]);
  }
  const loadNextPage = async () => {
    flash('Posts are loaded...', 'info', 2);
    const response = await api.get(url, {
      after: posts[posts.length - 1].timestamp
    });
    if (response.ok) {
      setPosts([...posts, ...response.body.data]);
      setPagination(response.body.pagination);
    }
  };

  return (
    <>
      {write && <Write showPost={showPost} />}
      {posts === null ?
        /*        flash('Could not retrieve blog posts from server', 'warning', 0) */
        <Alert color="warning">Could not retrieve blog posts</Alert>
        :
        <>
          {posts === undefined ?
            <>
              <Spinner animation="border" />
              <p>Getting data from {BASE_API_URL}</p>
            </>
            :
            <>
              {posts.length === 0 ?
                <p>There are no blog posts yet!</p>
                :
                posts.map(post => <Post key={post.id} post={post} />)
              }
              <Container>
                <Row>
                  <Col>
                    <Top />
                  </Col>
                  <Col>
                    <More pagination={pagination} loadNextPage={loadNextPage} />
                  </Col>
                </Row>
              </Container>
            </>
          }
        </>
      }
    </>
  );
}