import {objectType} from "@nexus/schema";
import {fromUnixTime} from "date-fns";
import {prisma} from "../db";

export const Match = objectType({
  name: 'Match',
  definition(t) {
    t.string('match_id')
    t.string('name')
    t.int('leaderboard_id')
    t.int('map_type')
    t.datetime('started', { resolve: (x: any) => fromUnixTime(x.started), nullable: false })
    t.datetime('finished', { resolve: (x: any) => x.finished ? fromUnixTime(x.finished) : null, nullable: true })

    t.list.field('players', {
      type: 'Player',
      resolve: parent =>
        prisma.match
          .findOne({
            where: { match_id: parent.match_id },
          })
          .players(),
    })
  },
})

export const MatchList = objectType({
  name: 'MatchList',
  definition(t) {
    t.int('total')
    t.list.field('matches', { type: 'Match'})
  },
})
