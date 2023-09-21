import PropTypes from "prop-types";
import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import createPromise from "./createPromise.js";

const useConfirm = () => {
  const [open, setOpen] = useState(false);
  const [resolver, setResolver] = useState({ resolver: null });

  const getConfirmation = async () => {
    setOpen(true);
    const [promise, resolve] = await createPromise();
    setResolver({ resolve });
    return promise;
  };

  const onClose = async (status) => {
    setOpen(false);
    resolver.resolve(status);
  };

  const ConfirmModal = ({
    message,
    title,
    confirmText,
    cancelText,
    confirmColor,
    cancelColor,
    className,
    buttonsComponent,
    size,
    bodyComponent,
    modalProps,
  }) => {
    let buttonsContent = (
      <>
        {cancelText && (
          <Button color={cancelColor} onClick={() => onClose(false)}>
            {cancelText}
          </Button>
        )}{" "}
        <Button color={confirmColor} onClick={() => onClose(true)}>
          {confirmText}
        </Button>
      </>
    );

    if (buttonsComponent) {
      const CustomComponent = buttonsComponent;
      buttonsContent = <CustomComponent onClose={onClose} />;
    }

    let BodyComponent = bodyComponent;

    return (
      <Modal
        size={size}
        isOpen={open}
        toggle={() => onClose(false)}
        className={`reactstrap-confirm ${className}`}
        {...modalProps}
      >
        {title && <ModalHeader toggle={() => onClose(false)}>{title || null}</ModalHeader>}
        <ModalBody>{bodyComponent ? <BodyComponent /> : message}</ModalBody>
        <ModalFooter>{buttonsContent}</ModalFooter>
      </Modal>
    );
  };

  ConfirmModal.defaultProps = {
    message: "Are you sure?",
    title: "Warning!",
    confirmText: "Ok",
    cancelText: "Cancel",
    confirmColor: "primary",
    cancelColor: "",
    className: "",
    buttonsComponent: null,
    size: null,
    bodyComponent: null,
    modalProps: {},
  };

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
  return [getConfirmation, ConfirmModal];
};

export default useConfirm;
