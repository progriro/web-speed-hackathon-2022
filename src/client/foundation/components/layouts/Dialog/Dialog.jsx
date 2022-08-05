import React from "react";
import styled from "styled-components";

import { Color } from "../../../styles/variables";

const StyledDialog = styled.dialog`
  border: 1px solid ${Color.mono[400]};

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.25);
  }
`;

/**
 * @typedef Props
 * @type {object}
 * @property {boolean} isOpen
 * @property {Function} onClose
 * @property {Function} onOpen
 */

/** @type {React.FC<Props>} */
export const Dialog = ({ children, isOpen, onClose, onOpen }) => {
  const dialogRef = React.useRef();

  React.useEffect(() => {
    if (!dialogRef.current) return;

    if (isOpen) {
      // @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/dialog
      dialogRef.current.showModal();
      onOpen?.();
    } else {
      dialogRef.current.close();
    }
  }, [isOpen, onOpen]);

  return (
    <StyledDialog ref={dialogRef} onClose={onClose}>
      {children}
    </StyledDialog>
  );
};

Dialog.displayName = "Dialog";
