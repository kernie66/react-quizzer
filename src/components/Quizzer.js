import { memo } from "react";
import { Link } from "react-router-dom";
import { Container, Media, Row } from "reactstrap";
import TimeAgo from "./TimeAgo";
import { useTranslation } from "react-i18next";

export default memo(function Quizzer({ quizzer }) {
  const { t } = useTranslation();

  return (
    <Container fluid className="Quizzer px-0">
      <div className="d-flex flex-row border-bottom justify-content-start">
        <div className="Avatar48 ps-0 pe-3 mx-0">
          <Media>
            <Link to={"/user/" + quizzer.id}>
              <Media
                object
                src={quizzer.avatar_url + "&s=48"}
                alt={quizzer.username}
                className="rounded-circle"
              />
            </Link>
          </Media>
        </div>
        <div className="col">
          <div className="flex-row">
            <div className="col">
              <span>
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
              </span>
            </div>
          </div>
          <Row className="mb-0">
            <p>{quizzer.email}</p>
          </Row>
          <Row className="mb-0">
            {quizzer.isAdmin && <span className="text-dark mt-0 mb-2">{t("administrator")}</span>}
          </Row>
        </div>
      </div>
    </Container>
  );
});
