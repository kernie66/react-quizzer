import { Button, Form, Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import { useEffect, useRef } from "react";
import Avatar from "./Avatar.js";
import { useImmer } from "use-immer";
import { useTranslation } from "react-i18next";

const avatarTypes = ["wavatar", "identicon", "monsterid", "retro", "robohash"];

export default function ChangeAvatar({ modal, closeModal, user }) {
  const api = useApi();
  const flash = useFlash();
  const avatarField = useRef();
  const [userData, setUserData] = useImmer(user); // useState(user);
  const { t } = useTranslation();

  const url = user.avatarUrl.split("d=")[0];
  console.log("Change avatar IDs:", user.id, userData.id);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const onOpened = () => {
    avatarField.current.value = user.avatarType;
    avatarField.current.focus();
  };

  const changeAvatar = () => {
    console.log("Avatar:", avatarField.current.value);
    const avatar = avatarField.current.value;
    const newUrl = url + `d=${avatar}`;
    setUserData((draft) => {
      draft.avatarType = avatar;
      draft.avatarUrl = newUrl;
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log("Update:", userData.avatarType);
    const response = await api.put("/users/" + user.id, { avatarType: userData.avatarType });
    if (response.ok) {
      flash(t("your-profile-has-been-updated"), "success", 5);
      closeModal();
    }
  };

  return (
    <Modal isOpen={modal} onOpened={onOpened} toggle={closeModal} fullscreen="sm">
      <ModalHeader toggle={closeModal}>{t("change-avatar")}</ModalHeader>
      <ModalBody className="pt-0">
        <div className="d-flex py-1 flex-row">
          <div className="pe-2">
            <Avatar user={userData} size={64} />
          </div>
          <div className="px-2 text-info">
            {t(
              "try-the-different-avatar-types-below-or-define-your-own-free-avatar-based-on-your-email-at",
            )}
            &nbsp;
            <em>
              <a href="https://en.gravatar.com" target="_blank" rel="noreferrer">
                Gravatar
              </a>
            </em>
          </div>
        </div>
        <Form onSubmit={onSubmit}>
          <div className="py-2">
            <Label for="selectGravatar">{t("select-your-preferred-avatar")}</Label>
            <Input id="selectGravatar" type="select" innerRef={avatarField} onChange={changeAvatar}>
              {avatarTypes.map((avatar, index) => (
                <option key={index}>{avatar}</option>
              ))}
            </Input>
          </div>
          <Button color="primary" type="submit">
            {t("update")}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
}
