import { useRef, useState } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import { useImmer } from "use-immer";
import { useTranslation } from "react-i18next";
import { useErrorBoundary } from "react-error-boundary";
import { sift } from "radash";
import { useQuery } from "@tanstack/react-query";
import getQuizzers from "../helpers/getQuizzers.js";

export default function EditUser({ modal, closeModal, user }) {
  const nameField = useRef();
  const emailField = useRef();
  const aboutMeField = useRef();
  const [userData, setUserData] = useImmer(user);
  const [nameError, setNameError] = useState();
  const [emailAddressError, setEmailAddressError] = useState();
  const api = useApi();
  const flash = useFlash();
  const { t } = useTranslation();
  const { showBoundary } = useErrorBoundary();

  const onOpened = () => {
    nameField.current.value = user.name;
    emailField.current.value = user.email;
    aboutMeField.current.value = user.aboutMe || "";
    nameField.current.focus();
  };

  const {
    //isLoading: isLoadingQuizzers,
    isError: quizzerError,
    data: quizzers,
  } = useQuery(
    {
      queryKey: ["quizzers", { api, excludeId: user.id }],
      queryFn: () => getQuizzers(api, user.id),
    },
    [api, user.id],
  );

  const checkFields = () => {
    console.log("User's name:", nameField.current.value);
    const checkEmail = quizzers.filter((quizzer) => {
      return quizzer.email === emailField.current.value.toLowerCase();
    });
    console.log(
      "Filter:",
      quizzers.filter((quizzer) => {
        return quizzer.email === emailField.current.value.toLowerCase();
      }),
    );
    if (checkEmail) {
      setEmailAddressError("Email address is already in use");
    }
    setUserData((draft) => {
      draft.name = nameField.current.value;
      draft.email = emailField.current.value;
      draft.aboutMe = aboutMeField.current.value;
    });
    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const currentErrors = [nameError, emailAddressError, quizzerError];
      console.log("Sift:", sift(currentErrors), currentErrors);
      let errors = sift(currentErrors).length !== 0;
      console.log("Errors:", errors);
      if (!userData.name) {
        setNameError(t("please-enter-a-name"));
        errors = true;
      }
      if (!userData.email) {
        setEmailAddressError(t("please-enter-a-valid-email-address"));
        errors = true;
      }

      if (errors) {
        return;
      }

      const response = await api.put("/users/" + user.id, {
        name: userData.name,
        email: userData.email,
        aboutMe: userData.aboutMe,
      });

      if (response.ok) {
        flash(t("your-profile-has-been-updated"), "success", 5);
        closeModal();
      }
    } catch (error) {
      showBoundary(error);
    }
  };

  return (
    <Modal isOpen={modal} onOpened={onOpened} toggle={closeModal} fullscreen="sm">
      <ModalHeader toggle={closeModal}>{t("edit-quizzer-information")}</ModalHeader>
      <ModalBody className="pt-0">
        <Form onSubmit={onSubmit}>
          <InputField
            label={t("name")}
            name="name"
            fieldRef={nameField}
            error={nameError}
            onBlur={checkFields}
          />
          <InputField
            label={t("email")}
            name="email"
            type="email"
            fieldRef={emailField}
            error={emailAddressError}
            onBlur={checkFields}
          />
          <InputField
            label={t("about-me")}
            name="aboutMe"
            type="textarea"
            fieldRef={aboutMeField}
            onBlur={checkFields}
          />
          <Button color="primary" type="submit">
            {t("update")}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
}
