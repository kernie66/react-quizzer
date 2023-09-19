import { Alert, Col, Container, Row, Spinner } from "reactstrap";
import { useApi } from "../contexts/ApiProvider";
import Top from "./Top";
import { useQuery } from "@tanstack/react-query";
import Quizzer from "./Quizzer.js";
import { useTranslation } from "react-i18next";
import getQuizzers from "../helpers/getQuizzers.js";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function Quizzers({ currentId }) {
  const api = useApi();
  const { t } = useTranslation();

  const fetchQuizzers = (id) => {
    return getQuizzers(api, id);
  };

  const {
    isLoading: isLoadingQuizzers,
    isError: quizzerError,
    data: quizzers,
  } = useQuery(
    {
      queryKey: ["quizzers", { excludeId: currentId }],
      queryFn: () => fetchQuizzers(currentId),
    },
    [currentId],
  );

  return (
    <>
      {quizzerError ? (
        <Alert color="warning">{t("could-not-retrieve-quizzers")}</Alert>
      ) : (
        <>
          {isLoadingQuizzers ? (
            <>
              <Spinner animation="border" />
              <p>
                {t("getting-data-from")} {BASE_API_URL}
              </p>
            </>
          ) : (
            <>
              {quizzers.length === 0 ? (
                <p>{t("there-are-no-quizzers-registered-yet")}</p>
              ) : (
                quizzers.map((quizzer) => <Quizzer key={quizzer.id} quizzer={quizzer} />)
              )}
              {quizzers.length > 5 ? (
                <Container fluid>
                  <Row>
                    <Col>
                      <Top />
                    </Col>
                    <Col></Col>
                  </Row>
                </Container>
              ) : null}
            </>
          )}
        </>
      )}
    </>
  );
}
