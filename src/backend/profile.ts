import {objectType} from "@nexus/schema";
import {fromUnixTime} from "date-fns";
import {prisma} from "./db";

export const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.int('profile_id')
    t.string('name')

    t.field('leaderboard1v1', {
      type: 'Leaderboard',
      nullable: true,
      resolve: parent =>
          prisma.leaderboard_row
              .findOne({
                where: { leaderboard_id_profile_id: { leaderboard_id: 3, profile_id: parent.profile_id } },
              }),
    })

    // t.list.field('players', {
    //   type: 'Player',
    //   resolve: parent =>
    //     prisma.match
    //       .findOne({
    //         where: { match_id: parent.match_id },
    //       })
    //       .players(),
    // })
  },
})
