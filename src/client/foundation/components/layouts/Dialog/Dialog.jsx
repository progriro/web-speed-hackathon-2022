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
 * @property {Function} setZenginCode
 */

/** @type {React.FC<Props>} */
export const Dialog = ({ children, isOpen, onClose, setZenginCode }) => {
  const dialogRef = React.useRef();

  React.useEffect(() => {
    if (!dialogRef.current) return;

    if (isOpen) {
      // @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/dialog
      dialogRef.current.showModal();
      import("zengin-code")
        .then((zenginCode) => {
          setZenginCode(zenginCode);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      dialogRef.current.close();
    }
  }, [isOpen, setZenginCode]);

  return (
    <StyledDialog ref={dialogRef} onClose={onClose}>
      {children}
    </StyledDialog>
  );
};

Dialog.displayName = "Dialog";
