import { memo } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Media, Row } from "reactstrap";
import TimeAgo from "./TimeAgo";

export default memo(function Post({ post }) {
  return (
    <Container className="Post">
      <Row className="border-bottom">
        <Col xs="1" className="Avatar48">
          <Media src={post.author.avatar_url + "&s=48"}
            alt={post.author.username} className="rounded-circle" />
        </Col>
        <Col>
          <Row>
            <p>
              <Link to={'/user/' + post.author.username} className="text-info text-decoration-none">
                {post.author.username}
              </Link>
              &nbsp;&mdash;&nbsp;
              <TimeAgo isoDate={post.timestamp} />:
            </p>
          </Row>
          <Row>
            <p>
              {post.text}
            </p>
          </Row>
        </Col>
      </Row>
    </Container>
  )
});