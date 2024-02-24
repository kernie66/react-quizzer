import Quizzer from "./Quizzer.js";
import { useTranslation } from "react-i18next";
import { Affix, Button, Divider, ScrollArea, Stack, Text, Transition, rem } from "@mantine/core";
import { TbArrowUp } from "react-icons/tb";
import { useWindowScroll } from "@mantine/hooks";
import { useExcludeQuizzerQuery } from "../hooks/useQuizzersQuery.js";
import QuizzerLoadingError from "./QuizzerLoadingError.js";
import QuizzersLoading from "./QuizzersLoading.js";

export default function Quizzers({ currentId }) {
  const { t } = useTranslation();
  const [scroll, scrollTo] = useWindowScroll();

  const {
    isLoading: isLoadingQuizzers,
    isError: isQuizzerError,
    data: quizzers,
  } = useExcludeQuizzerQuery(currentId); //useQuizzersQuery();

  if (isLoadingQuizzers) {
    return <QuizzersLoading />;
  }

  if (isQuizzerError) {
    return <QuizzerLoadingError />;
  }

  return (
    <>
      <ScrollArea type="always" offsetScrollbars mah="75vh">
        {quizzers.length === 0 ? (
          <Text>{t("there-are-no-quizzers-registered-yet")}</Text>
        ) : (
          quizzers.map((quizzer) => (
            <>
              <Stack gap={0} key={quizzer.id}>
                <Quizzer quizzer={quizzer} key={quizzer.id + 1000} />
                <Divider mb={4} key={quizzer.id + 2000} />
              </Stack>
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
  );
}
