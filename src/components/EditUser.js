import { useRef, useState } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import InputField from "../components/InputField";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import { useImmer } from "use-immer";
import { useTranslation } from "react-i18next";

export default function EditUser({ modal, closeModal, user }) {
  const [formErrors, setFormErrors] = useState({});
  const nameField = useRef();
  const emailField = useRef();
  const aboutMeField = useRef();
  const [userData, setUserData] = useImmer(user);
  const api = useApi();
  const flash = useFlash();
  const { t } = useTranslation();

  const onOpened = () => {
    nameField.current.value = user.name;
    emailField.current.value = user.email;
    aboutMeField.current.value = user.aboutMe || "";
    nameField.current.focus();
  };

  const checkFields = () => {
    console.log("User:", nameField.current.value);
    setUserData((draft) => {
      draft.name = nameField.current.value;
      draft.email = emailField.current.value;
      draft.aboutMe = aboutMeField.current.value;
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const response = await api.put("/users/" + user.id, {
      name: userData.name,
      email: userData.email,
      aboutMe: userData.aboutMe,
    });

    if (response.ok) {
      setFormErrors({});
      flash(t("your-profile-has-been-updated"), "success", 5);
      closeModal();
    } else {
      setFormErrors(response.body.errors.json);
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
            error={formErrors.name}
            onBlur={checkFields}
          />
          <InputField
            label={t("email")}
            name="email"
            type="email"
            fieldRef={emailField}
            error={formErrors.email}
            onBlur={checkFields}
          />
          <InputField
            label={t("about-me")}
            name="aboutMe"
            type="textarea"
            fieldRef={aboutMeField}
            error={formErrors.aboutMe}
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
