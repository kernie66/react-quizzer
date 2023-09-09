import { memo } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Media, Row } from "reactstrap";
import TimeAgo from "./TimeAgo";
import { useTranslation } from "react-i18next";

export default memo(function Quizzer({ quizzer }) {
  const { t } = useTranslation();

  return (
    <Container fluid="md" className="Quizzer">
      <Row className="border-bottom">
        <Col xs="2" lg="1" className="Avatar48">
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
              {quizzer.lastPlayed ? (
                <>
                  <span>{t("last-played")} </span>
                  <TimeAgo isoDate={quizzer.lastPlayed} />
                </>
              ) : (
                <span>{t("never-played")}</span>
              )}
            </p>
          </Row>
          <Row className="mb-0">
            <p>{quizzer.email}</p>
          </Row>
          <Row>
            {quizzer.isAdmin && <span className="text-dark mt-0 mb-2">{t("administrator")}</span>}
          </Row>
        </Col>
      </Row>
    </Container>
  );
});
