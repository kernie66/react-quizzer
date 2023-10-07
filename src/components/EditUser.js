import { useApi } from "../contexts/ApiProvider";
import { useTranslation } from "react-i18next";
import { useErrorBoundary } from "react-error-boundary";
import { isEmpty, sift, trim } from "radash";
import { useQuery } from "@tanstack/react-query";
import getQuizzers from "../helpers/getQuizzers.js";
import isValidEmail from "../helpers/isValidEmail.js";
import useConfirm from "../hooks/useConfirm.js";
import isInvalidUsername from "../helpers/isInvalidUsername.js";
import { showNotification } from "@mantine/notifications";
import { IconArrowBackUp, IconCheck } from "@tabler/icons-react";
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
import { useSetState } from "@mantine/hooks";
import { useForm } from "@mantine/form";

export default function EditUser({ opened, close, user }) {
  const [confirmModalText, setConfirmModalText] = useSetState({});
  const [getConfirmation, ConfirmModal] = useConfirm();
  const api = useApi();
  const { t } = useTranslation();
  const { showBoundary } = useErrorBoundary();

  const form = useForm({
    initialValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      aboutMe: user.aboutMe || "",
    },
    validate: {
      name: (value) => (value.length < 2 ? t("please-enter-a-name") : null),
    },
  });

  // Helper function with api parameter
  const fetchQuizzers = (id) => {
    return getQuizzers(api, id);
  };

  const {
    isLoading: isLoadingQuizzers,
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
    let usernameError;

    const newUsername = trim(form.values.username.toLowerCase());
    form.setFieldValue("username", newUsername);
    if (newUsername && newUsername !== user.username) {
      const invalidUsername = isInvalidUsername(newUsername);
      usernameError = invalidUsername && t(invalidUsername);

      if (!usernameError) {
        const checkUsername = quizzers.filter((quizzer) => {
          return quizzer.username === newUsername;
        });

        if (!isEmpty(checkUsername)) {
          usernameError = t("username-already-registered");
        } else {
          setConfirmModalText({
            title: t("update-username"),
            message: (
              <Text>
                {t("do-you-want-to-change-your-username")}
                <br />
                {t("from")}:&nbsp;
                <Text span c="green" fw={500}>
                  {user.username}
                </Text>
                <br />
                {t("to")}:&nbsp;
                <Text span c="blue" fw={500}>
                  {newUsername}
                </Text>
              </Text>
            ),
            confirmText: t("confirm"),
            cancelText: t("cancel"),
            size: "sm",
          });
          const confirm = await getConfirmation();
          if (!confirm) {
            form.setFieldValue("username", user.username);
          }
        }
      }
    } else {
      usernameError = t("please-enter-a-username");
    }

    form.setFieldError("username", usernameError);
    return Promise.resolve("Username checked");
  };

  const checkEmail = async () => {
    let emailError;

    const newEmailAddress = trim(form.values.email.toLowerCase());
    form.setFieldValue("email", newEmailAddress);
    if (newEmailAddress && newEmailAddress !== user.email) {
      if (!isValidEmail(newEmailAddress)) {
        emailError = t("please-enter-a-valid-email-address");
      } else {
        const checkEmailAddress = quizzers.filter((quizzer) => {
          return quizzer.email === newEmailAddress;
        });

        if (!isEmpty(checkEmailAddress)) {
          emailError = t("email-address-already-registered");
        } else if (!isValidEmail(newEmailAddress)) {
          emailError = t("please-enter-a-valid-email-address");
        } else {
          setConfirmModalText({
            title: t("update-email"),
            message: (
              <Text>
                {t("do-you-want-to-change-your-email")}
                <br />
                {t("from")}:&nbsp;
                <Text span c="green" fw={500}>
                  {user.email}
                </Text>
                <br />
                {t("to")}:&nbsp;
                <Text span c="blue" fw={500}>
                  {newEmailAddress}
                </Text>
              </Text>
            ),
            confirmText: t("confirm"),
            cancelText: t("cancel"),
            size: "",
          });
          const confirm = await getConfirmation();
          if (!confirm) {
            form.setFieldValue("email", user.email);
          }
        }
      }
    } else {
      emailError = t("please-enter-a-valid-email-address");
    }
    form.setFieldError("email", emailError);
    return Promise.resolve("Email not changed");
  };

  const onSubmit = async () => {
    try {
      const currentErrors = [quizzerError];
      let errors = sift(currentErrors).length !== 0;

      if (errors) {
        return;
      }

      const response = await api.put("/users/" + user.id, {
        name: form.values.name,
        email: form.values.email,
        aboutMe: form.values.aboutMe,
      });

      if (response.ok) {
        showNotification({
          title: form.values.name,
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
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            label={t("name")}
            {...form.getInputProps("name")}
            withAsterisk
            mb="md"
            rightSectionPointerEvents="all"
            rightSection={
              <IconArrowBackUp
                aria-label="Undo input"
                onClick={() => form.setFieldValue("name", user.name)}
                style={{ display: form.values.name != user.name ? undefined : "none" }}
              />
            }
          />
          <TextInput
            label={t("username")}
            {...form.getInputProps("username")}
            withAsterisk
            mb="md"
            onBlur={checkUsername}
            rightSectionPointerEvents="all"
            rightSection={
              <IconArrowBackUp
                aria-label="Undo input"
                onClick={() => form.setFieldValue("username", user.username)}
                style={{ display: form.values.username != user.username ? undefined : "none" }}
              />
            }
          />
          <TextInput
            label={t("email")}
            {...form.getInputProps("email")}
            withAsterisk
            mb="md"
            onBlur={checkEmail}
            rightSectionPointerEvents="all"
            rightSection={
              <IconArrowBackUp
                aria-label="Undo input"
                onClick={() => form.setFieldValue("email", user.email)}
                style={{ display: form.values.email != user.email ? undefined : "none" }}
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
                style={{ display: form.values.aboutMe ? undefined : "none" }}
              />
            }
          />
          <Group justify="space-between" my={8}>
            <Button type="submit" loading={isLoadingQuizzers}>
              {t("update")}
            </Button>
            <Button variant="outline" onClick={onSubmit}>
              {t("cancel")}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
