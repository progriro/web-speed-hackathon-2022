import React from "react";
import styled from "styled-components";

import { BreakPoint, Color, Radius, Space } from "../../../styles/variables";
import { Stack } from "../../layouts/Stack";

/**
 * @typedef ItemProps
 * @property {string} to
 */

const ItemWrapper = styled.li`
  button {
    background: white;
    border: 1px solid ${Color.mono[400]};
    border-radius: ${Radius.MEDIUM};
    cursor: pointer;
    display: block;
    font-weight: bold;
    padding-bottom: ${Space * 1}px;
    padding-top: ${Space * 1}px;
    text-align: center;
    width: 96px;

    &:hover {
      border-color: ${Color.mono[600]};
    }

    &[aria-current="true"] {
      background: ${Color.mono[900]};
      color: ${Color.mono[0]};
      cursor: text;
    }

    @media (min-width: ${BreakPoint.TABLET}px) {
      width: 160px;
    }
  }
`;

/** @type {React.FC<ItemProps & React.AnchorHTMLAttributes>} */
const Item = ({ "aria-current": ariaCurrent, children, onClick, ...rest }) => {
  return (
    <ItemWrapper>
      {ariaCurrent ? (
        <button aria-current {...rest}>
          {children}
        </button>
      ) : (
        <button aria-current={ariaCurrent} onClick={onClick} {...rest}>
          {children}
        </button>
      )}
    </ItemWrapper>
  );
};

export const TabNav = ({ children }) => {
  return (
    <nav>
      <Stack horizontal as="ul" gap={Space * 2}>
        {children}
      </Stack>
    </nav>
  );
};

TabNav.Item = Item;
