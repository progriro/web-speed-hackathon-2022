import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm";

dayjs.extend(utc);

import { assets } from "../../client/foundation/utils/UrlUtils.js";
import { BettingTicket, Race, User } from "../../model/index.js";
import { createConnection } from "../typeorm/connection.js";
import { initialize } from "../typeorm/initialize.js";

/**
 * @type {import('fastify').FastifyPluginCallback}
 */
export const apiRoute = async (fastify) => {
  fastify.get("/users/me", async (req, res) => {
    const repo = (await createConnection()).getRepository(User);

    if (req.user != null) {
      res.send(req.user);
    } else {
      const user = await repo.save(new User());
      res.send(user);
    }
  });

  fastify.post("/users/me/charge", async (req, res) => {
    if (req.user == null) {
      throw fastify.httpErrors.unauthorized();
    }

    const { amount } = req.body;
    if (typeof amount !== "number" || amount <= 0) {
      throw fastify.httpErrors.badRequest();
    }

    const repo = (await createConnection()).getRepository(User);

    req.user.balance += amount;
    await repo.save(req.user);

    res.status(204).send();
  });

  fastify.get("/hero", async (_req, res) => {
    const url = assets("/images/hero.avif");
    res.send({ url });
  });

  fastify.get("/races", async (req, res) => {
    const since = req.query.since != null ? dayjs(req.query.since) : undefined;
    const until = req.query.until != null ? dayjs(req.query.until) : undefined;

    if (since != null && !since.isValid()) {
      throw fastify.httpErrors.badRequest();
    }
    if (until != null && !until.isValid()) {
      throw fastify.httpErrors.badRequest();
    }

    const repo = (await createConnection()).getRepository(Race);

    const where = {};
    if (since != null && until != null) {
      Object.assign(where, {
        startAt: Between(
          since.utc().format("YYYY-MM-DD HH:mm:ss"),
          until.utc().format("YYYY-MM-DD HH:mm:ss"),
        ),
      });
    } else if (since != null) {
      Object.assign(where, {
        startAt: MoreThanOrEqual(since.utc().format("YYYY-MM-DD HH:mm:ss")),
      });
    } else if (until != null) {
      Object.assign(where, {
        startAt: LessThanOrEqual(since.utc().format("YYYY-MM-DD HH:mm:ss")),
      });
    }

    const races = await repo.find({
      where,
    });

    const newRaces = Array.from(races).map((race) => {
      return {
        ...race,
        image: race.image.replace(".jpg", ".avif"),
      };
    });

    res.send({ races: newRaces });
  });

  fastify.get("/races/:raceId", async (req, res) => {
    const repo = (await createConnection()).getRepository(Race);

    const entries = req.query.entries ?? false;
    const player = req.query.player ?? false;

    let relations = [];

    if (entries && player) {
      relations = ["entries", "entries.player"];
    } else if (entries) {
      relations = ["entries"];
    }

    const race = await repo.findOne(req.params.raceId, { relations });

    if (race === undefined) {
      throw fastify.httpErrors.notFound();
    }

    let newRace = {};

    if (entries && player) {
      newRace = {
        ...race,
        entries: race.entries.map((e) => {
          return {
            ...e,
            player: {
              ...e.player,
              image: e.player.image.replace(".jpg", ".avif"),
            },
          };
        }),
        image: race.image.replace(".jpg", "-live.avif"),
      };
    } else if (entries) {
      newRace = {
        ...race,
        entries: race.entries.map((e) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { player, ...rest } = e;
          return { ...rest };
        }),
        image: race.image.replace(".jpg", "-live.avif"),
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { entries, ...rest } = race;
      newRace = { ...rest, image: race.image.replace(".jpg", "-live.avif") };
    }

    res.send(newRace);
  });

  fastify.get("/races/:raceId/entries", async (req, res) => {
    const repo = (await createConnection()).getRepository(Race);

    const race = await repo.findOne(req.params.raceId, {
      relations: ["entries", "entries.player"],
    });

    if (race === undefined) {
      throw fastify.httpErrors.notFound();
    }

    const newRace = {
      ...race,
      entries: race.entries.map((entry) => {
        const newFileName = entry.player.image.replace(".jpg", ".avif");
        return { ...entry, player: { ...entry.player, image: newFileName } };
      }),
      image: race.image.replace(".jpg", "-live.avif"),
    };

    res.send(newRace);
  });

  fastify.get("/races/:raceId/trifectaOdds", async (req, res) => {
    const repo = (await createConnection()).getRepository(Race);

    const race = await repo.findOne(req.params.raceId, {
      relations: ["trifectaOdds"],
    });

    if (race === undefined) {
      throw fastify.httpErrors.notFound();
    }

    res.send(race.trifectaOdds);
  });

  fastify.get("/races/:raceId/betting-tickets", async (req, res) => {
    if (req.user == null) {
      throw fastify.httpErrors.unauthorized();
    }

    const repo = (await createConnection()).getRepository(BettingTicket);
    const bettingTickets = await repo.find({
      where: {
        race: {
          id: req.params.raceId,
        },
        user: {
          id: req.user.id,
        },
      },
    });

    res.send({
      bettingTickets,
    });
  });

  fastify.post("/races/:raceId/betting-tickets", async (req, res) => {
    if (req.user == null) {
      throw fastify.httpErrors.unauthorized();
    }

    if (req.user.balance < 100) {
      throw fastify.httpErrors.preconditionFailed();
    }

    if (typeof req.body.type !== "string") {
      throw fastify.httpErrors.badRequest();
    }

    if (
      !Array.isArray(req.body.key) ||
      req.body.key.some((n) => typeof n !== "number")
    ) {
      throw fastify.httpErrors.badRequest();
    }

    const bettingTicketRepo = (await createConnection()).getRepository(
      BettingTicket,
    );
    const bettingTicket = await bettingTicketRepo.save(
      new BettingTicket({
        key: req.body.key,
        race: {
          id: req.params.raceId,
        },
        type: req.body.type,
        user: {
          id: req.user.id,
        },
      }),
    );

    const userRepo = (await createConnection()).getRepository(User);
    req.user.balance -= 100;
    await userRepo.save(req.user);

    res.send(bettingTicket);
  });

  fastify.post("/initialize", async (_req, res) => {
    await initialize();
    res.status(204).send();
  });
};
