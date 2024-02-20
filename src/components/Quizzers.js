import { useApi } from "../contexts/ApiProvider";
import { useQuery } from "@tanstack/react-query";
import Quizzer from "./Quizzer.js";
import { useTranslation } from "react-i18next";
import getQuizzers from "../helpers/getQuizzers.js";
import {
  Affix,
  Alert,
  Button,
  Divider,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Transition,
  rem,
} from "@mantine/core";
import { TbArrowUp, TbInfoCircle } from "react-icons/tb";
import { useWindowScroll } from "@mantine/hooks";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function Quizzers({ currentId }) {
  const api = useApi();
  const { t } = useTranslation();
  const [scroll, scrollTo] = useWindowScroll();

  const icon = <TbInfoCircle />;

  const fetchQuizzers = (id) => {
    return getQuizzers(api, id);
  };

  const {
    isLoading: isLoadingQuizzers,
    isError: quizzerError,
    data: quizzers,
  } = useQuery(
    {
      queryKey: ["quizzers"],
      queryFn: () => fetchQuizzers(),
    },
    //[currentId],
  );

  return (
    <>
      {quizzerError ? (
        <Alert variant="light" color="red" title="Quizzers" icon={icon}>
          {t("could-not-retrieve-quizzers")}
        </Alert>
      ) : (
        <>
          {isLoadingQuizzers ? (
            <>
              <Loader color="blue" />
              <Text span>
                {t("getting-data-from")} {BASE_API_URL}
              </Text>
            </>
          ) : (
            <>
              <ScrollArea type="always" offsetScrollbars mah="75vh">
                {quizzers.length === 0 ? (
                  <Text>{t("there-are-no-quizzers-registered-yet")}</Text>
                ) : (
                  quizzers.map((quizzer) => (
                    <>
                      {quizzer.id !== currentId ? (
                        <Stack gap={0} key={quizzer.id}>
                          <Quizzer quizzer={quizzer} />
                          <Divider mb={4} />
                        </Stack>
                      ) : (
                        <></>
                      )}
                    </>
                  ))
                )}
              </ScrollArea>
              {quizzers.length > 2 ? (
                <Affix position={{ bottom: 20, right: 20 }}>
                  <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                      <Button
                        leftSection={<TbArrowUp style={{ width: rem(16), height: rem(16) }} />}
                        style={transitionStyles}
                        onClick={() => scrollTo({ y: 0 })}
                      >
                        {t("scroll-to-top")}
                      </Button>
                    )}
                  </Transition>
                </Affix>
              ) : null}
            </>
          )}
        </>
      )}
    </>
  );
}
