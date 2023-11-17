// import PropTypes from "prop-types";
import { useState } from "react";
import createPromise from "../helpers/createPromise.js";
import { useDisclosure } from "@mantine/hooks";
import { Button, Divider, Group, Modal } from "@mantine/core";

const useConfirm = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [resolver, setResolver] = useState({ resolver: null });

  const getConfirmation = async () => {
    open();
    const [promise, resolve] = await createPromise();
    setResolver({ resolve });
    return promise;
  };

  const onClose = async (status) => {
    close();
    resolver.resolve(status);
  };

  const ConfirmModal = ({
    message,
    title,
    confirmText,
    cancelText,
    confirmColor,
    cancelColor,
    size,
  }) => {
    return (
      <Modal opened={opened} onClose={() => onClose(false)} size={size} centered title={title}>
        <Divider mb={8} />
        {message}
        <Group justify="space-between" my={8} pt={16}>
          <Button color={confirmColor} onClick={() => onClose(true)} data-autofocus>
            {confirmText}
          </Button>
          <Button color={cancelColor} variant="outline" onClick={() => onClose(false)}>
            {cancelText}
          </Button>
        </Group>
      </Modal>
    );
  };

  ConfirmModal.defaultProps = {
    message: "Are you sure?",
    title: "Warning!",
    confirmText: "Ok",
    cancelText: "Cancel",
    confirmColor: "",
    cancelColor: "",
    className: "",
    buttonsComponent: null,
    size: null,
    bodyComponent: null,
    modalProps: {},
  };

  /*
  ConfirmModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    message: PropTypes.node,
    title: PropTypes.node,
    confirmText: PropTypes.node,
    cancelText: PropTypes.node,
    confirmColor: PropTypes.string,
    cancelColor: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.string,
    buttonsComponent: PropTypes.func,
    bodyComponent: PropTypes.func,
    modalProps: PropTypes.object,
  };
  */

  return [getConfirmation, ConfirmModal];
};

export default useConfirm;
