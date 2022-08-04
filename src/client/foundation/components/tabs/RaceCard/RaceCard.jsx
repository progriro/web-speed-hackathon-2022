import React from "react";

import { Spacer } from "../../../components/layouts/Spacer";
import { useFetch } from "../../../hooks/useFetch";
import { Space } from "../../../styles/variables";
import { jsonFetcher } from "../../../utils/HttpUtils";

import { EntryTable } from "./internal/EntryTable";
import { PlayerPictureList } from "./internal/PlayerPictureList";

/** @type {React.VFC} */
export const RaceCard = ({ raceId }) => {
  const { data } = useFetch(`/api/races/${raceId}`, jsonFetcher);

  if (data == null) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Spacer mt={Space * 2} />
      <PlayerPictureList>
        {data.entries.map((entry) => (
          <PlayerPictureList.Item
            key={entry.id}
            image={entry.player.image}
            name={entry.player.name}
            number={entry.number}
          />
        ))}
      </PlayerPictureList>

      <Spacer mt={Space * 4} />
      <EntryTable entries={data.entries} />
    </>
  );
};
