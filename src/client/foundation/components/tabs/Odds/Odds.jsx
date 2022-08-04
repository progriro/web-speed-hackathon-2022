import dayjs from "dayjs";
import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { Spacer } from "../../../components/layouts/Spacer";
import { Heading } from "../../../components/typographies/Heading";
import { useFetch } from "../../../hooks/useFetch";
import { Color, Space } from "../../../styles/variables";
import { jsonFetcher } from "../../../utils/HttpUtils";

import { OddsRankingList } from "./internal/OddsRankingList";
import { OddsTable } from "./internal/OddsTable";
import { TicketVendingModal } from "./internal/TicketVendingModal";

const Callout = styled.aside`
  align-items: center;
  background: ${({ $closed }) =>
    $closed ? Color.mono[200] : Color.green[100]};
  color: ${({ $closed }) => ($closed ? Color.mono[600] : Color.green[500])};
  display: flex;
  font-weight: bold;
  gap: ${Space * 2}px;
  justify-content: left;
  padding: ${Space * 1}px ${Space * 2}px;
`;

const CalloutPlaceholder = styled.div`
  background-color: ${Color.mono[200]};
  height: 40px;
  width: 100%;
`;

const OddsTablePlaceholder = styled.div`
  height: 462px;
  width: 100%;
`;

/** @type {React.VFC} */
export const Odds = ({ raceId }) => {
  const { data } = useFetch(`/api/races/${raceId}`, jsonFetcher);
  const [oddsKeyToBuy, setOddsKeyToBuy] = useState(null);
  const modalRef = useRef(null);

  const handleClickOdds = useCallback(
    /**
     * @param {Model.OddsItem} odds
     */
    (odds) => {
      setOddsKeyToBuy(odds.key);
      modalRef.current?.showModal();
    },
    [],
  );

  const isRaceClosed = useMemo(() => {
    if (!data) return false;
    return dayjs(data.closeAt).isBefore(new Date());
  }, [data]);

  return (
    <>
      <Spacer mt={Space * 4} />

      {data ? (
        <Callout $closed={isRaceClosed}>
          <i className="fas fa-info-circle" />
          {isRaceClosed
            ? "このレースの投票は締め切られています"
            : "オッズをクリックすると拳券が購入できます"}
        </Callout>
      ) : (
        <CalloutPlaceholder />
      )}

      <Spacer mt={Space * 4} />
      <Heading as="h2">オッズ表</Heading>

      <Spacer mt={Space * 2} />
      {data ? (
        <OddsTable
          entries={data.entries}
          isRaceClosed={isRaceClosed}
          odds={data.trifectaOdds}
          onClickOdds={handleClickOdds}
        />
      ) : (
        <OddsTablePlaceholder />
      )}

      <Spacer mt={Space * 4} />
      <Heading as="h2">人気順</Heading>

      <Spacer mt={Space * 2} />
      {data && (
        <OddsRankingList
          isRaceClosed={isRaceClosed}
          odds={data.trifectaOdds}
          onClickOdds={handleClickOdds}
        />
      )}

      <TicketVendingModal ref={modalRef} odds={oddsKeyToBuy} raceId={raceId} />
    </>
  );
};
