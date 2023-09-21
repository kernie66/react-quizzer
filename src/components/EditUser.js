import { useRef } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import { useImmer } from "use-immer";
import { useTranslation } from "react-i18next";
import { useErrorBoundary } from "react-error-boundary";
import { isEmpty, sift } from "radash";
import { useQuery } from "@tanstack/react-query";
import getQuizzers from "../helpers/getQuizzers.js";
import isValidEmail from "../helpers/isValidEmail.js";
import useConfirm from "../helpers/useConfirm.js";

export default function EditUser({ modal, closeModal, user }) {
  const usernameField = useRef();
  const nameField = useRef();
  const emailField = useRef();
  const aboutMeField = useRef();
  const [userData, setUserData] = useImmer(user);
  const [getConfirmation, ConfirmModal] = useConfirm();
  const api = useApi();
  const flash = useFlash();
  const { t } = useTranslation();
  const { showBoundary } = useErrorBoundary();

  const onOpened = () => {
    usernameField.current.value = user.username;
    nameField.current.value = user.name;
    emailField.current.value = user.email;
    aboutMeField.current.value = user.aboutMe || "";
    nameField.current.focus();
  };

  const fetchQuizzers = (id) => {
    return getQuizzers(api, id);
  };

  const {
    //isLoading: isLoadingQuizzers,
    isError: quizzerError,
    data: quizzers,
  } = useQuery(
    {
      queryKey: ["quizzers", { excludeId: user.id }],
      queryFn: () => fetchQuizzers(user.id),
    },
    [user.id],
  );

  const checkUsername = async () => {
    let usernameStatus;
    let errors = false;

    const newUsername = usernameField.current.value.toLowerCase();
    usernameField.current.value = newUsername;
    if (newUsername !== user.username) {
      const checkUsername = quizzers.filter((quizzer) => {
        return quizzer.username === newUsername;
      });
      console.log("Username filter:", checkUsername);

      if (!isEmpty(checkUsername)) {
        console.log("Username:", checkUsername);
        usernameStatus = t("username-already-registered");
        errors = true;
      } else {
        const confirm = await getConfirmation();
        console.log("Confirm?", confirm);
        if (!confirm) {
          usernameField.current.value = user.username;
          return true;
        }
      }

      setUserData((draft) => {
        draft.usernameError = usernameStatus;
      });

      if (!errors) {
        setUserData((draft) => {
          draft.username = usernameField.current.value;
        });
      }
    }
    return true;
  };

  const checkFields = async () => {
    let usernameStatus, emailStatus;
    let errors = false;

    const newUsername = usernameField.current.value.toLowerCase();
    const newEmailAddress = emailField.current.value.toLowerCase();

    console.log("User's name:", nameField.current.value);
    const checkUsername = quizzers.filter((quizzer) => {
      return quizzer.username === newUsername;
    });
    console.log("Username filter:", checkUsername);

    const checkEmail = quizzers.filter((quizzer) => {
      return quizzer.email === newEmailAddress;
    });
    console.log("Email filter:", checkEmail);

    if (!isEmpty(checkUsername)) {
      console.log("Username:", checkUsername);
      usernameStatus = t("username-already-registered");
      errors = true;
    }

    if (!isEmpty(checkEmail)) {
      emailStatus = t("email-address-already-registered");
      errors = true;
    } else if (!isValidEmail(newEmailAddress)) {
      emailStatus = t("please-enter-a-valid-email-address");
    }

    setUserData((draft) => {
      draft.usernameError = usernameStatus;
      draft.emailAddressError = emailStatus;
    });

    if (!errors) {
      setUserData((draft) => {
        draft.name = nameField.current.value;
        draft.email = emailField.current.value;
        draft.aboutMe = aboutMeField.current.value;
      });
    }
    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    // await checkUsername();
    let usernameStatus = userData.usernameError;
    let nameStatus = userData.nameError;
    let emailStatus = userData.emailAddressError;

    try {
      const currentErrors = [usernameStatus, nameStatus, emailStatus, quizzerError];
      console.log("Sift:", sift(currentErrors), currentErrors);
      let errors = sift(currentErrors).length !== 0;
      console.log("Errors:", errors);
      if (!userData.name) {
        nameStatus = t("please-enter-a-name");
        errors = true;
      }
      if (!userData.username) {
        usernameStatus = t("please-enter-a-username");
        errors = true;
      }
      if (!userData.email) {
        emailStatus = t("please-enter-a-valid-email-address");
        errors = true;
      }

      if (errors) {
        setUserData((draft) => {
          draft.usernameError = usernameStatus;
          draft.nameError = nameStatus;
          draft.emailAddressError = emailStatus;
        });
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
    <>
      <ConfirmModal />
      <Modal isOpen={modal} onOpened={onOpened} toggle={closeModal} fullscreen="sm">
        <ModalHeader toggle={closeModal}>{t("edit-quizzer-information")}</ModalHeader>
        <ModalBody className="pt-0">
          <Form onSubmit={onSubmit}>
            <InputField
              label={t("name")}
              name="name"
              fieldRef={nameField}
              error={userData.nameError}
            />
            <InputField
              label={t("username")}
              name="username"
              fieldRef={usernameField}
              error={userData.usernameError}
              isValid={userData.usernameValid}
              onBlur={checkUsername}
            />
            <InputField
              label={t("email")}
              name="email"
              type="email"
              fieldRef={emailField}
              error={userData.emailAddressError}
              onBlur={checkFields}
            />
            <InputField
              label={t("about-me")}
              name="aboutMe"
              type="textarea"
              fieldRef={aboutMeField}
            />
            <Button color="primary" type="submit">
              {t("update")}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}
