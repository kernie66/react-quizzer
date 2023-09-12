import { Button, Form, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar.js";

const avatarTypes = ["wavatar", "identicon", "monsterid", "retro", "robohash"];

export default function ChangeAvatar({ modal, closeModal, user }) {
  const api = useApi();
  const flash = useFlash();
  const avatarField = useRef();
  const [userData, setUserData] = useState(user);

  const url = user.avatarUrl.split("d=")[0];

  const onOpened = () => {
    avatarField.current.value = user.avatarType;
    avatarField.current.focus();
  };

  const changeAvatar = () => {
    console.log("Avatar:", avatarField.current.value);
    const avatar = avatarField.current.value;
    const newUrl = url + `d=${avatar}`;
    let updatedUser = {};
    updatedUser.avatarType = avatar;
    updatedUser.avatarUrl = newUrl;
    setUserData((userData) => ({
      ...userData,
      ...updatedUser,
    }));
  };

  useEffect(() => {
    console.log("Userdata:", userData.avatarType);
  }, [userData]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const response = await api.put("/me", {});
    if (response.ok) {
      flash("Your profile has been updated.", "success", 5);
      closeModal();
    }
  };

  return (
    <Modal isOpen={modal} onOpened={onOpened} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>Change avatar</ModalHeader>
      <ModalBody className="pt-0">
        <Avatar user={userData} size={64} />
        <Form onSubmit={onSubmit}>
          <Input type="select" innerRef={avatarField} onChange={changeAvatar}>
            {avatarTypes.map((avatar, index) => (
              <option key={index}>{avatar}</option>
            ))}
          </Input>
          <Button color="primary" type="submit">
            Update
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
}
