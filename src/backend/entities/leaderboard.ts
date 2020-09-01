import {objectType} from "@nexus/schema";
import {fromUnixTime} from "date-fns";
import {prisma} from "../db";

export const Leaderboard = objectType({
  name: 'Leaderboard',
  definition(t) {
    t.int('leaderboard_id')
    t.int('profile_id')
    t.string('steam_id')
    t.string('name')
    t.string('country')
    t.string('clan', {nullable: true})
    t.string('icon', {nullable: true})
    t.int('rating')
    t.int('highest_rating')
    t.int('previous_rating')
    t.int('games')
    t.int('wins')
    t.int('losses')
    t.int('drops')
    t.int('streak')
    t.int('lowest_streak')
    t.int('highest_streak')
    t.string('last_match')
    t.datetime('last_match_time', { resolve: (x: any) => fromUnixTime(x.last_match_time), nullable: false })
  },
})
