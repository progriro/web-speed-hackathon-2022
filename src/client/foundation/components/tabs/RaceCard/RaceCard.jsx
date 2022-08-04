import React from "react";
import styled from "styled-components";

import { Spacer } from "../../../components/layouts/Spacer";
import { useFetch } from "../../../hooks/useFetch";
import { Space } from "../../../styles/variables";
import { range } from "../../../utils/ArrayUtils";
import { jsonFetcher } from "../../../utils/HttpUtils";

import { EntryTable } from "./internal/EntryTable";
import { PlayerPictureList } from "./internal/PlayerPictureList";

const LIST_ITEM_PH_NUM = 10;

const PlayerPictureListItemPlaceholder = styled.div`
  height: 132px;
  width: 100px;
`;

/** @type {React.VFC} */
export const RaceCard = ({ raceId }) => {
  const { data } = useFetch(`/api/races/${raceId}`, jsonFetcher);

  return (
    <>
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
              <PlayerPictureListItemPlaceholder key={i} />
            ))}
      </PlayerPictureList>

      <Spacer mt={Space * 4} />
      {data && <EntryTable entries={data.entries} />}
    </>
  );
};
