import { useApi } from "../contexts/ApiProvider";
import { useTranslation } from "react-i18next";
import { useErrorBoundary } from "react-error-boundary";
import { isEmpty, sift, trim } from "radash";
import isValidEmail from "../helpers/isValidEmail";
import useConfirm from "../hooks/useConfirm";
import isInvalidUsername from "../helpers/isInvalidUsername";
import { showNotification } from "@mantine/notifications";
import { TbArrowBackUp, TbCheck, TbExclamationCircle, TbX } from "react-icons/tb";
import { useSetState, useShallowEffect } from "@mantine/hooks";
import { hasLength, useForm } from "@mantine/form";
import {
  Button,
  CloseButton,
  Divider,
  Group,
  Modal,
  Text,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import { useQuizzersQuery } from "../hooks/useQuizzersQuery";

export default function EditUser({ opened, close, user }) {
  const { t } = useTranslation();
  const [confirmModalText, setConfirmModalText] = useSetState({
    title: "",
    message: "",
    confirmText: t("confirm"),
    cancelText: t("cancel"),
    size: "sm",
  });
  const [_user, setUser] = useSetState(user);
  const [confirmedChange, setConfirmedChange] = useSetState({ username: "", email: "" });
  const [displayUndo, setDisplayUndo] = useSetState({
    name: false,
    username: false,
    email: false,
    aboutMe: false,
  });
  const [getConfirmation, ConfirmModal] = useConfirm();
  const api = useApi();
  const { showBoundary } = useErrorBoundary();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: _user.name,
      username: _user.username,
      email: _user.email,
      aboutMe: _user.aboutMe || "",
    },
    validateInputOnBlur: true,
    onValuesChange: (values) => {
      setDisplayUndo({
        name: form.isDirty("name"),
        username: form.isDirty("username"),
        email: values.email !== _user.email,
        aboutMe: values.aboutMe !== _user.aboutMe,
      });
    },
    validate: {
      name: hasLength({ min: 2, max: 20 }, t("please-enter-a-name")),
      username: (value) => checkUsername(value),
      email: (value) => checkEmail(value),
    },
  });

  useShallowEffect(() => {
    setUser(user);
  }, [user]);

  useShallowEffect(() => {
    console.log("user", user);
    form.setInitialValues(user);
    form.setValues(user);
  }, [user]);

  const {
    isLoading: isLoadingQuizzers,
    isError: quizzerError,
    data: quizzers,
  } = useQuizzersQuery();

  const checkUsername = (username) => {
    let usernameError = null;

    const newUsername = trim(username.toLowerCase());
    console.log("newUsername", newUsername);
    form.setFieldValue("username", newUsername);
    if (newUsername) {
      if (newUsername !== _user.username) {
        const invalidUsername = isInvalidUsername(newUsername);
        if (invalidUsername) {
          usernameError = t(invalidUsername);
        } else {
          const existingUsername = quizzers.filter((quizzer) => {
            return quizzer.username === newUsername;
          });
          if (!isEmpty(existingUsername)) {
            usernameError = t("username-already-registered");
          }
        }
        if (!usernameError) {
          if (newUsername !== confirmedChange.username) {
            updateUsername(newUsername);
          }
        }
      }
    } else {
      usernameError = t("please-enter-a-username");
    }
    return usernameError;
  };

  const updateUsername = async (newUsername) => {
    let confirmedUsername = newUsername;

    setConfirmModalText({
      title: t("update-username"),
      message: (
        <Text>
          {t("do-you-want-to-change-your-username")}
          <br />
          {t("from")}:&nbsp;
          <Text span c="green" fw={500}>
            {_user.username}
          </Text>
          <br />
          {t("to")}:&nbsp;
          <Text span c="blue" fw={500}>
            {newUsername}
          </Text>
        </Text>
      ),
    });
    const confirm = await getConfirmation();
    if (!confirm) {
      form.setFieldValue("username", _user.username);
      confirmedUsername = "";
    }
    setConfirmedChange({ username: confirmedUsername });
    return Promise.resolve("Username to be updated");
  };

  const checkEmail = (email) => {
    let emailError = null;

    const newEmailAddress = trim(email.toLowerCase());
    form.setFieldValue("email", newEmailAddress);
    if (newEmailAddress) {
      if (newEmailAddress !== _user.email) {
        if (!isValidEmail(newEmailAddress)) {
          emailError = t("please-enter-a-valid-email-address");
        } else {
          const existingEmailAddress = quizzers.filter((quizzer) => {
            return quizzer.email === newEmailAddress;
          });
          if (!isEmpty(existingEmailAddress)) {
            emailError = t("email-address-already-registered");
          } else if (!isValidEmail(newEmailAddress)) {
            emailError = t("please-enter-a-valid-email-address");
          }
        }
        if (!emailError) {
          if (newEmailAddress !== confirmedChange.email) {
            updateEmail(newEmailAddress);
          }
        }
      }
    } else {
      emailError = t("please-enter-a-valid-email-address");
    }
    return emailError;
  };

  const updateEmail = async (newEmailAddress) => {
    let confirmedEmail = newEmailAddress;

    setConfirmModalText({
      title: t("update-email"),
      message: (
        <Text>
          {t("do-you-want-to-change-your-email")}
          <br />
          {t("from")}:&nbsp;
          <Text span c="green" fw={500}>
            {_user.email}
          </Text>
          <br />
          {t("to")}:&nbsp;
          <Text span c="blue" fw={500}>
            {newEmailAddress}
          </Text>
        </Text>
      ),
    });
    const confirm = await getConfirmation();
    if (!confirm) {
      form.setFieldValue("email", _user.email);
      confirmedEmail = "";
    }
    setConfirmedChange({ email: confirmedEmail });
    return Promise.resolve("Email to be updated");
  };

  const onSubmit = async () => {
    try {
      const currentErrors = [quizzerError];
      let errors = sift(currentErrors).length !== 0;

      if (errors) {
        return;
      }
      const formValues = form.getValues();

      console.log("Dirty?", form.isDirty());
      if (form.isDirty()) {
        const response = await api.put("/users/" + _user.id, {
          name: formValues.name,
          email: formValues.email,
          aboutMe: formValues.aboutMe,
        });

        if (response.ok) {
          showNotification({
            title: formValues.name,
            message: t("your-profile-has-been-updated"),
            color: "green",
            icon: <TbCheck style={{ width: rem(18), height: rem(18) }} />,
          });
        } else {
          showNotification({
            title: formValues.name,
            message: t("the-profile-could-not-be-updated"),
            color: "red",
            icon: <TbX style={{ width: rem(18), height: rem(18) }} />,
          });
        }
      } else {
        showNotification({
          title: formValues.name,
          message: t("the-profile-was-not-changed"),
          color: "blue",
          icon: <TbExclamationCircle style={{ width: rem(18), height: rem(18) }} />,
        });
      }
      close();
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
      <Modal opened={opened} onClose={close} centered title={t("edit-quizzer-information")}>
        <Divider mb={8} />
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            label={t("name")}
            {...form.getInputProps("name")}
            withAsterisk
            mb="md"
            rightSectionPointerEvents="all"
            rightSection={
              <TbArrowBackUp
                aria-label="Undo input"
                onClick={() => form.setFieldValue("name", _user.name)}
                style={{ display: displayUndo.name ? undefined : "none" }}
              />
            }
            data-autofocus
          />
          <TextInput
            label={t("username")}
            {...form.getInputProps("username")}
            withAsterisk
            mb="md"
            rightSectionPointerEvents="all"
            rightSection={
              <TbArrowBackUp
                aria-label="Undo input"
                onClick={() => form.setFieldValue("username", _user.username)}
                style={{ display: displayUndo.username ? undefined : "none" }}
              />
            }
          />
          <TextInput
            label={t("email")}
            {...form.getInputProps("email")}
            withAsterisk
            mb="md"
            rightSectionPointerEvents="all"
            rightSection={
              <TbArrowBackUp
                aria-label="Undo input"
                onClick={() => form.setFieldValue("email", _user.email)}
                style={{ display: displayUndo.email ? undefined : "none" }}
              />
            }
          />
          <Textarea
            label={t("about-me")}
            {...form.getInputProps("aboutMe")}
            rightSectionPointerEvents="all"
            rightSection={
              <CloseButton
                aria-label="Clear input"
                onClick={() => form.setFieldValue("aboutMe", "")}
                style={{ display: displayUndo.aboutMe ? undefined : "none" }}
              />
            }
          />
          <Group justify="space-between" my={8} pt={16}>
            <Button type="submit" loading={isLoadingQuizzers}>
              {t("update")}
            </Button>
            <Button variant="outline" onClick={close}>
              {t("cancel")}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
