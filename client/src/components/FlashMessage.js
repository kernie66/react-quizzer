import { useContext } from 'react';
import { Alert, Collapse } from 'reactstrap';
import { FlashContext } from '../contexts/FlashProvider';

export default function FlashMessage() {
  const { flashMessage, visible, hideFlash } = useContext(FlashContext);

  return (
    <Collapse isOpen={visible} className='FlashMessage'>
      <Alert color={flashMessage.type || 'info'} toggle={hideFlash}>
        {flashMessage.message}
      </Alert>
    </Collapse>
  );
}