import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { Container } from "../../components/layouts/Container";
import { Spacer } from "../../components/layouts/Spacer";
import { Stack } from "../../components/layouts/Stack";
import { Heading } from "../../components/typographies/Heading";
import { useAuthorizedFetch } from "../../hooks/useAuthorizedFetch";
import { useFetch } from "../../hooks/useFetch";
import { Color, Radius, Space } from "../../styles/variables";
import { range } from "../../utils/ArrayUtils";
import { authorizedJsonFetcher, jsonFetcher } from "../../utils/HttpUtils";

import { ChargeDialog } from "./internal/ChargeDialog";
import { HeroImage } from "./internal/HeroImage";
import { RecentRaceList } from "./internal/RecentRaceList";

const LIST_ITEM_PH_NUM = 5;

const RecentRaceListItemPlaceholder = styled.div`
  height: 148px;
  width: 100%;
  background: ${Color.mono[0]};
  border-radius: ${Radius.MEDIUM};
`;

const ChargeButton = styled.button`
  background: ${Color.mono[700]};
  border-radius: ${Radius.MEDIUM};
  color: ${Color.mono[0]};
  padding: ${Space * 1}px ${Space * 2}px;

  &:hover {
    background: ${Color.mono[800]};
  }
`;

/** @type {React.VFC} */
export const Top = ({ date = dayjs().format("YYYY-MM-DD") }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: userData, revalidate } = useAuthorizedFetch(
    "/api/users/me",
    authorizedJsonFetcher,
  );

  const { data: HeroData } = useFetch("/api/hero", jsonFetcher);

  const params = new URLSearchParams();
  params.append("since", dayjs(date).startOf("day").toISOString());
  params.append("until", dayjs(date).endOf("day").toISOString());

  const { data: raceData } = useFetch(
    `/api/races?${params.toString()}`,
    jsonFetcher,
  );

  const handleClickChargeButton = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleCompleteCharge = useCallback(() => {
    revalidate();
  }, [revalidate]);

  return (
    <Container>
      <div style={{ aspectRatio: "auto 1024 / 735", backgroundColor: "#fff" }}>
        {HeroData && <HeroImage url={HeroData.url} />}
      </div>

      <Spacer mt={Space * 2} />
      {userData && (
        <Stack horizontal alignItems="center" justifyContent="space-between">
          <div>
            <p>ポイント残高: {userData.balance}pt</p>
            <p>払戻金: {userData.payoff}Yeen</p>
          </div>

          <ChargeButton onClick={handleClickChargeButton}>
            チャージ
          </ChargeButton>
        </Stack>
      )}

      <Spacer mt={Space * 2} />
      <section>
        <Heading as="h1">本日のレース</Heading>
        {raceData && raceData.races.length > 0 ? (
          <RecentRaceList>
            {raceData.races.map((race, i) => (
              <RecentRaceList.Item key={race.id} index={i} race={race} />
            ))}
          </RecentRaceList>
        ) : (
          <Stack gap={Space * 2}>
            {range(0, LIST_ITEM_PH_NUM).map((i) => (
              <RecentRaceListItemPlaceholder key={i} />
            ))}
          </Stack>
        )}
      </section>

      <ChargeDialog
        isOpen={isOpen}
        onClose={handleClose}
        onComplete={handleCompleteCharge}
      />
    </Container>
  );
};
