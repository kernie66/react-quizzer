import { memo } from "react";
import { Link } from "react-router-dom";
import { Container, Row } from "reactstrap";
import TimeAgo from "./TimeAgo";
import { useTranslation } from "react-i18next";
import QuizzerAvatar from "./QuizzerAvatar.js";

export default memo(function Quizzer({ quizzer }) {
  const { t } = useTranslation();

  return (
    <Container fluid className="Quizzer px-0">
      <div className="d-flex flex-row border-bottom justify-content-start">
        <div className="Avatar48 ps-0 pe-3 mx-0">
          <QuizzerAvatar user={quizzer} size={48} />
        </div>
        <div className="col">
          <div className="flex-row">
            <div className="col">
              <span>
                <Link
                  to={"/user/" + quizzer.id}
                  className="text-info-emphasis text-decoration-none"
                >
                  {quizzer.name}
                </Link>
                {quizzer.isAdmin && (
                  <span className="text-danger">&nbsp;({t("administrator")})</span>
                )}
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
            <p className="text-info">
              {t("email")}: {quizzer.email}
            </p>
          </Row>
        </div>
      </div>
    </Container>
  );
});
