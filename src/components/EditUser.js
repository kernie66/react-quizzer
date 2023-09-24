import { useRef } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import { useImmer } from "use-immer";
import { useTranslation } from "react-i18next";
import { useErrorBoundary } from "react-error-boundary";
import { isEmpty, sift, trim } from "radash";
import { useQuery } from "@tanstack/react-query";
import getQuizzers from "../helpers/getQuizzers.js";
import isValidEmail from "../helpers/isValidEmail.js";
import useConfirm from "../hooks/useConfirm.js";
import isValidUsername from "../helpers/isValidUsername.js";

export default function EditUser({ modal, closeModal, user }) {
  const usernameField = useRef();
  const nameField = useRef();
  const emailField = useRef();
  const aboutMeField = useRef();
  const [userData, setUserData] = useImmer(user);
  const [confirmModalText, setConfirmModalText] = useImmer({});
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
    setUserData((draft) => {
      draft.usernameError = undefined;
      draft.usernameValid = undefined;
      draft.emailError = undefined;
      draft.emailValid = undefined;
    });
    setConfirmModalText((draft) => {
      draft.title = "";
      draft.message = "";
      draft.size = "sm";
    });
  };

  // Helper function with api parameter
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
    let usernameStatus, usernameValid;

    setUserData((draft) => {
      draft.usernameError = usernameStatus;
      draft.usernameValid = usernameValid;
    });

    const newUsername = trim(usernameField.current.value.toLowerCase());
    usernameField.current.value = newUsername;
    if (newUsername && newUsername !== user.username) {
      const validUsername = isValidUsername(newUsername);
      usernameStatus = validUsername && t(validUsername);

      if (!usernameStatus) {
        const checkUsername = quizzers.filter((quizzer) => {
          return quizzer.username === newUsername;
        });
        console.log("Username filter:", checkUsername);

        if (!isEmpty(checkUsername)) {
          console.log("Username:", checkUsername);
          usernameStatus = t("username-already-registered");
        } else {
          setConfirmModalText((draft) => {
            draft.title = t("update-username");
            draft.message = (
              <>
                {t("do-you-want-to-change-your-username")}
                <br />
                {t("from")}:&nbsp;
                <span className="text-success fs-5">{user.username}</span>
                <br />
                {t("to")}:&nbsp;
                <span className="text-info fs-5">{newUsername}</span>
              </>
            );
            draft.confirmText = t("confirm");
            draft.cancelText = t("cancel");
            draft.size = "sm";
          });
          const confirm = await getConfirmation();
          console.log("Confirm?", confirm);
          if (!confirm) {
            usernameField.current.value = user.username;
          } else {
            usernameValid = t("username-is-available");
          }
        }
      }

      setUserData((draft) => {
        draft.usernameError = usernameStatus;
        draft.usernameValid = usernameValid;
      });

      if (!usernameStatus) {
        setUserData((draft) => {
          draft.username = usernameField.current.value;
        });
        return Promise.resolve("Username changed");
      }
    } else {
      usernameField.current.value = user.username;
    }
    return Promise.resolve("Username not changed");
  };

  const checkEmail = async () => {
    let emailStatus, emailValid;

    setUserData((draft) => {
      draft.emailError = emailStatus;
      draft.emailValid = emailValid;
    });

    const newEmailAddress = trim(emailField.current.value.toLowerCase());
    emailField.current.value = newEmailAddress;
    if (newEmailAddress && newEmailAddress !== user.email) {
      if (!isValidEmail(newEmailAddress)) {
        emailStatus = t("please-enter-a-valid-email-address");
      } else {
        const checkEmailAddress = quizzers.filter((quizzer) => {
          return quizzer.email === newEmailAddress;
        });
        console.log("Email filter:", checkEmailAddress);

        if (!isEmpty(checkEmailAddress)) {
          console.log("Email:", checkEmailAddress);
          emailStatus = t("email-address-already-registered");
        } else if (!isValidEmail(newEmailAddress)) {
          emailStatus = t("please-enter-a-valid-email-address");
        } else {
          setConfirmModalText((draft) => {
            draft.title = t("update-email");
            draft.message = (
              <>
                {t("do-you-want-to-change-your-email")}
                <br />
                {t("from")}:&nbsp;
                <span className="text-success fs-5">{user.email}</span>
                <br />
                {t("to")}:&nbsp;
                <span className="text-info fs-5">{newEmailAddress}</span>
              </>
            );
            draft.confirmText = t("confirm");
            draft.cancelText = t("cancel");
            draft.size = "";
          });
          const confirm = await getConfirmation();
          console.log("Confirm?", confirm);
          if (!confirm) {
            emailField.current.value = user.email;
          } else {
            emailValid = t("email-address-is-available");
          }
        }

        setUserData((draft) => {
          draft.emailError = emailStatus;
          draft.emailValid = emailValid;
        });

        if (!emailStatus) {
          setUserData((draft) => {
            draft.email = emailField.current.value;
          });
          return Promise.resolve("Email changed");
        }
      }
    } else {
      emailField.current.value = user.email;
    }
    return Promise.resolve("Email not changed");
  };

  const checkFields = () => {
    setUserData((draft) => {
      draft.name = nameField.current.value;
      draft.aboutMe = aboutMeField.current.value;
    });
    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let usernameStatus = userData.usernameError;
    let nameStatus = userData.nameError;
    let emailStatus = userData.emailError;

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
          draft.usernameValid = undefined;
          draft.nameError = nameStatus;
          draft.emailError = emailStatus;
          draft.emailValid = undefined;
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
      <ConfirmModal
        title={confirmModalText.title}
        message={confirmModalText.message}
        confirmText={confirmModalText.confirmText}
        cancelText={confirmModalText.cancelText}
        size={confirmModalText.size}
      />
      <Modal isOpen={modal} onOpened={onOpened} toggle={closeModal} fullscreen="sm">
        <ModalHeader toggle={closeModal}>{t("edit-quizzer-information")}</ModalHeader>
        <ModalBody className="pt-0">
          <Form onSubmit={onSubmit}>
            <InputField
              label={t("name")}
              name="name"
              fieldRef={nameField}
              error={userData.nameError}
              onBlur={checkFields}
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
              error={userData.emailError}
              isValid={userData.emailValid}
              onBlur={checkEmail}
            />
            <InputField
              label={t("about-me")}
              name="aboutMe"
              type="textarea"
              fieldRef={aboutMeField}
              onBlur={checkFields}
            />
            <Button color="primary" onClick={onSubmit}>
              {t("update")}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}
