import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { EntryCombination } from "../../../../../components/displays/EntryCombination";
import { Dialog } from "../../../../../components/layouts/Dialog";
import { Spacer } from "../../../../../components/layouts/Spacer";
import { Stack } from "../../../../../components/layouts/Stack";
import { Heading } from "../../../../../components/typographies/Heading";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useAuthorizedFetch } from "../../../../../hooks/useAuthorizedFetch";
import { useMutation } from "../../../../../hooks/useMutation";
import { Color, Space } from "../../../../../styles/variables";
import { authorizedJsonFetcher } from "../../../../../utils/HttpUtils";

const CANCEL = "cancel";
const BUY = "buy";

const ErrorText = styled.p`
  color: ${Color.red};
`;

/**
 * @typedef Props
 * @type {object}
 * @property {string} raceId
 * @property {number[]} odds
 * @property {boolean} isOpen
 * @property {Function} onClose
 * @property {Function} onOpen
 */

/** @type {React.VFC<Props>} */
export const TicketVendingModal = ({
  isOpen,
  odds,
  onClose,
  onOpen,
  raceId,
}) => {
  const { loggedIn } = useAuth();
  const [buyTicket, buyTicketResult] = useMutation(
    `/api/races/${raceId}/betting-tickets`,
    {
      auth: true,
      method: "POST",
    },
  );
  const { data: userData, revalidate } = useAuthorizedFetch(
    "/api/users/me",
    authorizedJsonFetcher,
  );
  const [error, setError] = useState(null);

  const handleCloseDialog = useCallback(
    async (e) => {
      setError("");

      if (e.currentTarget.returnValue === CANCEL) {
        onClose();
        return;
      }

      await buyTicket({
        key: odds,
        type: "trifecta",
      });

      onClose();
    },
    [buyTicket, odds, onClose],
  );

  useEffect(() => {
    if (buyTicketResult === null || buyTicketResult.loading === true) {
      return;
    }

    const err = buyTicketResult.error;

    if (err === null) {
      revalidate();
      return;
    }

    onOpen();

    if (err.status === 412) {
      setError("残高が不足しています");
      return;
    }

    setError(err.message);
    console.error(err);
  }, [buyTicketResult, revalidate, onOpen]);

  const shouldShowForm = loggedIn && userData !== null && odds !== null;

  return (
    <Dialog isOpen={isOpen} onClose={handleCloseDialog}>
      <Heading as="h1">拳券の購入</Heading>

      <Spacer mt={Space * 2} />

      <form method="dialog">
        <Stack gap={Space * 1}>
          {!shouldShowForm ? (
            <>
              <ErrorText>購入するにはログインしてください</ErrorText>
              <menu>
                <button value={CANCEL}>閉じる</button>
              </menu>
            </>
          ) : (
            <>
              <div>
                <Stack horizontal>
                  購入する買い目: <EntryCombination numbers={odds} />
                </Stack>
              </div>
              <div>使用ポイント: 100pt</div>
              <div>所持しているポイント: {userData.balance}pt</div>
              <div>購入後に残るポイント: {userData.balance - 100}pt</div>
              {error && <ErrorText>{error}</ErrorText>}
              <menu>
                <button value={CANCEL}>キャンセル</button>
                <button value={BUY}>購入する</button>
              </menu>
            </>
          )}
        </Stack>
      </form>
    </Dialog>
  );
};

TicketVendingModal.displayName = "TicketVendingModal";
