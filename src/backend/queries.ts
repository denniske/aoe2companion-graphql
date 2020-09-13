import {intArg, objectType, queryType, stringArg} from '@nexus/schema'
import {prisma} from "./db";
import {sleep} from "../../util/use-lazy-api";
import { matchWhereInput } from '@prisma/client';

export const Query = queryType({
  definition(t) {
    t.field('str', {
      type: 'String',
      resolve: (_, args) => {
        return 'Hello World!';
      },
    })

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

    t.field('matches', {
      type: 'MatchList',
      args: {
        start: intArg({ nullable: false }),
        count: intArg({ nullable: false }),
        profile_id: intArg({ nullable: true }),
        leaderboard_id: intArg({ nullable: true }),
        search: stringArg({ nullable: true }),
      },
      resolve: async (_parent, args, ctx) => {
        // await sleep(200);

        // https://niallburkley.com/blog/index-columns-for-like-in-postgres/

        const search = `%${args.search}%`;

        const matchIds = await prisma.$queryRaw`
          SELECT m.match_id
          FROM player as p
          JOIN match as m ON m.match_id = p.match_id
          WHERE m.leaderboard_id=${args.leaderboard_id}
          AND m.match_id IN (
                SELECT m.match_id
                FROM player as p
                JOIN match as m ON m.match_id = p.match_id
                WHERE profile_id=${args.profile_id}
             )
          AND (p.name ILIKE ${search} OR m.name ILIKE ${search})
          GROUP BY m.match_id
          ORDER BY m.started desc
          LIMIT 5
        `;

        // console.log('matchIds', matchIds);

        const matches = await prisma.match.findMany({where: {match_id: {in: matchIds.map(x => x.match_id)}}});

        // const where = {
        //       leaderboard_id: args.leaderboard_id,
        //       AND: [
        //         { players: { some: { profile_id: args.profile_id } } },
        //         {
        //           OR: [
        //             { name: { contains: args.search, mode: 'insensitive' } },
        //             { players: { some: { name: { contains: args.search, mode: 'insensitive' } } } },
        //           ]
        //         }
        //       ],
        // } as matchWhereInput;
        // const aggregation = await prisma.match.aggregate({
        //   where,
        //   count: true,
        // });
        // const total = aggregation.count;
        // const matches = await prisma.match.findMany({
        //   where,
        //   skip: args.start,
        //   take: args.count,
        //   orderBy: { started: 'desc' },
        // });


        return {
          total: matches.length,
          matches,
        };
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
