import React from "react";
import styled from "styled-components";

import { Container } from "../../../components/layouts/Container";
import { Section } from "../../../components/layouts/Section";
import { Spacer } from "../../../components/layouts/Spacer";
import { TrimmedImage } from "../../../components/media/TrimmedImage";
import { TabNav } from "../../../components/navs/TabNav";
import { Heading } from "../../../components/typographies/Heading";
import { useFetch } from "../../../hooks/useFetch";
import { Color, Radius, Space } from "../../../styles/variables";
import { range } from "../../../utils/ArrayUtils";
import { formatTime } from "../../../utils/DateUtils";
import { jsonFetcher } from "../../../utils/HttpUtils";

import { EntryTable } from "./internal/EntryTable";
import { PlayerPictureList } from "./internal/PlayerPictureList";

const LIST_ITEM_PH_NUM = 10;

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

const EntryTablePlaceholder = styled.div`
  height: 500px;
`;

const PlayerPictureListItemPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 132px;
  width: 100px;
`;

const PlayerPicturePlaceholder = styled.div`
  height: 100px;
  width: 100px;
  border: 1px solid ${Color.mono[400]};
`;

const PlayerOrderPlaceholder = styled.div`
  height: 24px;
  width: 24px;
  border: 1px solid ${Color.mono[400]};
`;

/** @type {React.VFC} */
export const RaceCard = ({ raceId }) => {
  const { data } = useFetch(`/api/races/${raceId}`, jsonFetcher);

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
          <TrimmedImage
            height={225}
            lazy={false}
            src={data.image}
            width={400}
          />
        ) : (
          <TrimmedImagePlaceholder />
        )}
      </Section>

      <Spacer mt={Space * 2} />

      <Section>
        <TabNav>
          <TabNav.Item aria-current to={`/races/${raceId}/race-card`}>
            出走表
          </TabNav.Item>
          <TabNav.Item to={`/races/${raceId}/odds`}>オッズ</TabNav.Item>
          <TabNav.Item to={`/races/${raceId}/result`}>結果</TabNav.Item>
        </TabNav>

        <Spacer mt={Space * 2} />
        <PlayerPictureList>
          {data
            ? data.entries.map((entry) => (
                <PlayerPictureList.Item
                  key={entry.id}
                  image={entry.player.image}
                  name={entry.player.name}
                  number={entry.number}
                />
              ))
            : range(0, LIST_ITEM_PH_NUM).map((i) => (
                <PlayerPictureListItemPlaceholder key={i}>
                  <PlayerPicturePlaceholder />
                  <PlayerOrderPlaceholder />
                </PlayerPictureListItemPlaceholder>
              ))}
        </PlayerPictureList>

        <Spacer mt={Space * 4} />
        {data ? (
          <EntryTable entries={data.entries} />
        ) : (
          <EntryTablePlaceholder />
        )}
      </Section>
    </Container>
  );
};
