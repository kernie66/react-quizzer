import { useRef } from "react";
import { Form } from "reactstrap";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useTranslation } from "react-i18next";
import { useErrorBoundary } from "react-error-boundary";
import { isEmpty, sift, trim } from "radash";
import { useQuery } from "@tanstack/react-query";
import getQuizzers from "../helpers/getQuizzers.js";
import isValidEmail from "../helpers/isValidEmail.js";
import useConfirm from "../hooks/useConfirm.js";
import isValidUsername from "../helpers/isValidUsername.js";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { Button, Divider, Modal, Text, rem } from "@mantine/core";
import { useSetState } from "@mantine/hooks";

export default function EditUser({ opened, close, user }) {
  const usernameField = useRef();
  const nameField = useRef();
  const emailField = useRef();
  const aboutMeField = useRef();
  const [userData, setUserData] = useSetState(user);
  const [confirmModalText, setConfirmModalText] = useSetState({});
  const [getConfirmation, ConfirmModal] = useConfirm();
  const api = useApi();
  const { t } = useTranslation();
  const { showBoundary } = useErrorBoundary();

  /*  const onOpened = () => {
    usernameField.current.value = user.username;
    nameField.current.value = user.name;
    emailField.current.value = user.email;
    aboutMeField.current.value = user.aboutMe || "";
    nameField.current.focus();
    setUserData({
      usernameError: undefined,
      usernameValid: undefined,
      emailError: undefined,
      emailValid: undefined,
    });
    setConfirmModalText({
      title: "",
      message: "",
      size: "sm",
    });
  };
*/
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

    setUserData({
      usernameError: usernameStatus,
      usernameValid: usernameValid,
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

        if (!isEmpty(checkUsername)) {
          usernameStatus = t("username-already-registered");
        } else {
          setConfirmModalText({
            title: t("update-username"),
            message: (
              <Text>
                {t("do-you-want-to-change-your-username")}
                <br />
                {t("from")}:&nbsp;
                <span className="text-success fs-5">{user.username}</span>
                <br />
                {t("to")}:&nbsp;
                <span className="text-info fs-5">{newUsername}</span>
              </Text>
            ),
            confirmText: t("confirm"),
            cancelText: t("cancel"),
            size: "sm",
          });
          const confirm = await getConfirmation();
          if (confirm) {
            usernameValid = t("username-is-available");
          } else {
            usernameField.current.value = user.username;
          }
        }
      }

      setUserData({
        usernameError: usernameStatus,
        usernameValid: usernameValid,
      });

      if (!usernameStatus) {
        setUserData({
          username: usernameField.current.value,
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

    setUserData({
      emailError: emailStatus,
      emailValid: emailValid,
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

        if (!isEmpty(checkEmailAddress)) {
          emailStatus = t("email-address-already-registered");
        } else if (!isValidEmail(newEmailAddress)) {
          emailStatus = t("please-enter-a-valid-email-address");
        } else {
          setConfirmModalText({
            title: t("update-email"),
            message: (
              <Text>
                {t("do-you-want-to-change-your-email")}
                <br />
                {t("from")}:&nbsp;
                <span className="text-success fs-5">{user.email}</span>
                <br />
                {t("to")}:&nbsp;
                <span className="text-info fs-5">{newEmailAddress}</span>
              </Text>
            ),
            confirmText: t("confirm"),
            cancelText: t("cancel"),
            size: "",
          });
          // const confirm = await getConfirmation();
          if (confirm) {
            emailValid = t("email-address-is-available");
          } else {
            emailField.current.value = user.email;
          }
        }

        setUserData({
          emailError: emailStatus,
          emailValid: emailValid,
        });

        if (!emailStatus) {
          setUserData({
            email: emailField.current.value,
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
    let newName = nameField.current.value;

    if (!newName) {
      newName = user.name;
    }

    setUserData({
      name: newName,
      aboutMe: aboutMeField.current.value,
    });
    nameField.current.value = newName;
    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let usernameStatus = userData.usernameError;
    let nameStatus = userData.nameError;
    let emailStatus = userData.emailError;

    try {
      const currentErrors = [usernameStatus, nameStatus, emailStatus, quizzerError];
      let errors = sift(currentErrors).length !== 0;
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
        setUserData({
          usernameError: usernameStatus,
          usernameValid: undefined,
          nameError: nameStatus,
          emailError: emailStatus,
          emailValid: undefined,
        });
        return;
      }

      const response = await api.put("/users/" + user.id, {
        name: userData.name,
        email: userData.email,
        aboutMe: userData.aboutMe,
      });

      if (response.ok) {
        showNotification({
          title: userData.name,
          message: t("your-profile-has-been-updated"),
          icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        });
        close();
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
      <Modal
        opened={opened}
        onClose={close}
        centered
        title={<h5>{t("edit-quizzer-information")}</h5>}
      >
        <Divider mb={8} />
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
          <Button my={8} onClick={onSubmit}>
            {t("update")}
          </Button>
        </Form>
      </Modal>
    </>
  );
}
