import {objectType} from "@nexus/schema";
import {fromUnixTime} from "date-fns";
import {prisma} from "./db";

export const Leaderboard = objectType({
  name: 'Leaderboard',
  definition(t) {
    t.int('leaderboard_id')
    t.int('profile_id')
    t.string('name')
    t.string('country')
    t.int('rating')
  },
})
