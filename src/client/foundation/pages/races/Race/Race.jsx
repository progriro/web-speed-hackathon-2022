// import { route } from "preact-router";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { Container } from "../../../components/layouts/Container";
import { Section } from "../../../components/layouts/Section";
import { Spacer } from "../../../components/layouts/Spacer";
import { TrimmedImage } from "../../../components/media/TrimmedImage";
import { TabNav } from "../../../components/navs/TabNav";
import { Heading } from "../../../components/typographies/Heading";
import { useFetch } from "../../../hooks/useFetch";
import { Color, Radius, Space } from "../../../styles/variables";
import { formatTime } from "../../../utils/DateUtils";
import { jsonFetcher } from "../../../utils/HttpUtils";

const Odds = React.lazy(() => import("../../../components/tabs/Odds"));
const RaceCard = React.lazy(() => import("../../../components/tabs/RaceCard"));
const RaceResult = React.lazy(() =>
  import("../../../components/tabs/RaceResult"),
);

const LiveBadge = styled.span`
  background: ${Color.red};
  border-radius: ${Radius.SMALL};
  color: ${Color.mono[0]};
  font-weight: bold;
  padding: ${Space * 1}px;
  text-transform: uppercase;
`;

const HeadingPlaceholder = styled.div`
  height: 48px;
  margin-bottom: 8px;
`;

const PeriodPlaceholder = styled.div`
  height: 24px;
`;

const TrimmedImagePlaceholder = styled.div`
  height: 225px;
  width: 400px;
`;

// eslint-disable-next-line sort/object-properties
const TAB_NAME = { "race-card": "出走表", odds: "オッズ", result: "結果" };

/** @type {React.VFC} */
export const Race = ({ raceId }) => {
  const { data } = useFetch(`/api/races/${raceId}`, jsonFetcher);

  const initialTab = useMemo(() => {
    return location.pathname.split("/").at(-1);
  }, []);

  const [tab, setTab] = useState(initialTab);

  const handleClick = useCallback((tab) => {
    setTab(tab);
    // route(`/races/${raceId}/${tab}`, false);
  }, []);

  return (
    <Container>
      <Spacer mt={Space * 2} />
      {data ? <Heading as="h1">{data.name}</Heading> : <HeadingPlaceholder />}
      {data ? (
        <p>
          開始 {formatTime(data.startAt)} 締切 {formatTime(data.closeAt)}
        </p>
      ) : (
        <PeriodPlaceholder />
      )}

      <Spacer mt={Space * 2} />

      <Section dark shrink>
        <LiveBadge>Live</LiveBadge>
        <Spacer mt={Space * 2} />
        {data ? (
          <TrimmedImage height={225} src={data.image} width={400} />
        ) : (
          <TrimmedImagePlaceholder />
        )}
      </Section>

      <Spacer mt={Space * 2} />

      <Section>
        <TabNav>
          {Object.keys(TAB_NAME).map((key, index) => (
            <TabNav.Item
              key={index}
              aria-current={key === tab}
              onClick={() => handleClick(key)}
            >
              {TAB_NAME[key]}
            </TabNav.Item>
          ))}
        </TabNav>

        <React.Suspense fallback={<></>}>
          {tab === "race-card" && <RaceCard raceId={raceId} />}
          {tab === "odds" && <Odds raceId={raceId} />}
          {tab === "result" && <RaceResult raceId={raceId} />}
        </React.Suspense>
      </Section>
    </Container>
  );
};
