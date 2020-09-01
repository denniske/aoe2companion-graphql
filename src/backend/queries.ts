import {intArg, objectType, queryType, stringArg} from '@nexus/schema'
import {prisma} from "./db";

export const Query = queryType({
  definition(t) {
    t.field('match', {
      type: 'Match',
      args: {
        matchId: stringArg({ nullable: false }),
      },
      resolve: (_, args) => {
        return prisma.match.findOne({
          where: { match_id: args.matchId },
        })
      },
    })

    t.field('profile', {
      type: 'Profile',
      args: {
        profile_id: intArg({ nullable: true }),
      },
      resolve: async (_, args, ctx) => {
        return await prisma.user.findOne({
          where: {profile_id: args.profile_id},
        });
        // return {
        //   profile_id: args.profile_id,
        //   name: 'temp',
        // };
      },
    })

    t.list.field('matches', {
      type: 'Match',
      args: {
        start: intArg({ nullable: false }),
        count: intArg({ nullable: false }),
        profile_id: intArg({ nullable: true }),
        leaderboard_id: intArg({ nullable: true }),
      },
      resolve: (_parent, args, ctx) => {
        return prisma.match.findMany({
          where: {
            leaderboard_id: args.leaderboard_id,
            players: { some: { profile_id: args.profile_id } }
          },
          skip: args.start,
          take: args.count,
          orderBy: { started: 'desc' },
        })
      },
    })

    t.list.field('temp', {
      type: 'Match',
      resolve: (_parent, args, ctx) => {
        return prisma.match.findMany({
          where: {
            AND: [
              { players: { some: { profile_id: 196240 } } },
              { players: { some: { profile_id: 197930 } } },
              // { players: { some: { profile_id: 199325 } } },
            ],
          },
          skip: 0,
          take: 5,
          orderBy: { started: 'desc' },
        })
      },
    })

    t.list.field('temp2', {
      type: 'Match',
      resolve: (_parent, args, ctx) => {
        return prisma.match.findMany({
          where: {
            AND: [
              { players: { some: { profile_id: { in: [196240, 197930] } } } },
              // { players: { some: { OR: [{ profile_id: 196240 }, { profile_id: 197930 }] } } },
              // { players: { some: { profile_id: 197930 } } },
              // { players: { some: { profile_id: 199325 } } },
            ],
          },
          skip: 0,
          take: 5,
          orderBy: { started: 'desc' },
        })
      },
    })

    // t.list.field('filterMatchs', {
    //   type: 'Match',
    //   args: {
    //     searchString: stringArg({ nullable: true }),
    //   },
    //   resolve: (_, { searchString }, ctx) => {
    //     return prisma.match.findMany({
    //       where: {
    //         OR: [
    //           { title: { contains: searchString } },
    //           { content: { contains: searchString } },
    //         ],
    //       },
    //     })
    //   },
    // })
  },
})
