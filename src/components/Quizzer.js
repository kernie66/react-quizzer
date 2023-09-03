import { memo } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Media, Row } from "reactstrap";
import TimeAgo from "./TimeAgo";

export default memo(function Quizzer({ quizzer }) {
  return (
    <Container className="Quizzer">
      <Row className="border-bottom">
        <Col xs="1" className="Avatar48">
          <Media
            src={quizzer.avatar_url + "&s=48"}
            alt={quizzer.username}
            className="rounded-circle"
          />
        </Col>
        <Col>
          <Row>
            <p>
              <Link to={"/user/" + quizzer.id} className="text-primary text-decoration-none">
                {quizzer.name}
              </Link>
              &nbsp;&mdash;&nbsp;
              <TimeAgo isoDate={quizzer.lastSeen} />:
            </p>
          </Row>
          <Row className="mb-0">
            <p>{quizzer.email}</p>
          </Row>
          <Row>{quizzer.isAdmin && <span className="text-dark mt-0 mb-2">Administrator</span>}</Row>
        </Col>
      </Row>
    </Container>
  );
});
