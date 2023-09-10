//import { useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "reactstrap";
import { useApi } from "../contexts/ApiProvider";
//import { useFlash } from "../contexts/FlashProvider";
//import More from "./More";
import Top from "./Top";
import { useQuery } from "@tanstack/react-query";
import Quizzer from "./Quizzer.js";
import { alphabetical, fork } from "radash";
import { useTranslation } from "react-i18next";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function Quizzers({ currentId }) {
  // const [pagination, setPagination] = useState();
  const api = useApi();
  const { t } = useTranslation();

  const getQuizzers = async (currentId) => {
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
  } = useQuery(
    {
      queryKey: ["quizzers", { currentId }],
      queryFn: () => getQuizzers(currentId),
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
