import {objectType} from "@nexus/schema";
import {fromUnixTime} from "date-fns";
import {prisma} from "./db";

export const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.string('profile_id')
    t.string('name')



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
