import Router, { useRouter } from 'next/router'
import { withApollo } from '../../../apollo/client'
import gql from 'graphql-tag'
import {Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {useAppStyles} from "../../components/app-styles";
import {useQuery} from "@apollo/client";
import {fromUnixTime} from "date-fns";
import Rating from "../../components/rating";
import {makeStyles} from "@material-ui/core/styles";
import {IProfile} from "../../helper/types";
import {formatLeaderboardId} from "../../helper/util";
import {getCivIconByIndex, getCivName} from "../../helper/civs";
import {getFlagIcon} from "../../helper/flags";
import {IMatch} from "../../../util/api.types";
import {getMapImage, getMapName} from "../../helper/maps";
import Match from "../../components/match";


const ProfileQuery = gql`
  query ProfileQuery($profileId: Int!) {
    profile(profile_id: $profileId) {
      profile_id
      name
      last_match_time
      country
      games
      drops
      leaderboards {
        leaderboard_id
        profile_id
        steam_id
        name
        country
        clan
        icon
        rating
        highest_rating
        previous_rating
        games
        wins
        losses
        drops
        streak
        lowest_streak
        highest_streak
        last_match
        last_match_time
      }
      stats {
        leaderboard_id
        allies {
          name
          games
          wins
        }
        opponents {
          name
          games
          wins
        }
        civ {
          civ
          games
          wins
        }
        map_type {
          map_type
          games
          wins
        }
      }
      rating_history {
        leaderboard_id
        profile_id
        history {
          rating
          timestamp
        }
      }
    }
  }
`

interface IProfileQuery {
  profile: IProfile;
}


const MatchesQuery = gql`
  query MatchesQuery($profileId: Int!) {
    matches(
      start: 0,
      count: 5,
      profile_id: $profileId,
      leaderboard_id: 0
    ) {
      match_id
      leaderboard_id
      name
      map_type
      started
      finished
      players {
        profile_id
        name
        rating
        civ
        slot
        slot_type
        color
        won
        team
      }
    }
  }
`

interface IMatchesQuery {
  matches: IMatch[];
}

function Post() {
  const appClasses = useAppStyles();
  const classes = useStyles();
  const profileId = useRouter().query.id as string;

  const profileResult = useQuery<IProfileQuery, any>(ProfileQuery, {
    variables: { profileId: parseInt(profileId) },
    skip: profileId == null,
  })

  const matchesResult = useQuery<IMatchesQuery, any>(MatchesQuery, {
    variables: { profileId: parseInt(profileId) },
    skip: profileId == null,
  })

  const profile = profileResult.data?.profile;
  const matches = matchesResult.data?.matches;

  console.log('matches', matches);

  // console.log('PROFILE', profileId);
  // console.log('DATA', data);
  // console.log('profile', data?.profile);
  // console.log('last_match_time', data?.profile?.last_match_time);

  return (
    <div>
      <Paper className={appClasses.box}>
        {/*<Typography variant="body1" noWrap>*/}
        {/*  Profile*/}
        {/*</Typography>*/}
        {/*<Typography variant="subtitle2" noWrap>*/}
        {/*  {profileId}*/}
        {/*</Typography>*/}
        {
          profile &&
          <div>
            <div className={classes.row2}>
              <img src={getFlagIcon(profile.country)} className={classes.flagIcon} />
              {profile.name}
            </div>
            <div className={classes.row2}>
              {profile.games} Games, {profile.drops} Drops ({(profile.drops / profile.games * 100).toFixed(2)} %)
            </div>
          </div>
        }
      </Paper>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Leaderboard</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="right"/>
              <TableCell align="right">Highest Rating</TableCell>
              <TableCell align="right">Games</TableCell>
              <TableCell align="right">Wins</TableCell>
              <TableCell align="right">Streak</TableCell>
              <TableCell align="right">Drops</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profile?.leaderboards.map((leaderboard) => (
                <TableRow key={formatLeaderboardId(leaderboard.leaderboard_id)}>
                  <TableCell component="th" scope="row">
                    {formatLeaderboardId(leaderboard.leaderboard_id)}
                  </TableCell>
                  <TableCell align="right">{leaderboard.rating}</TableCell>
                  <TableCell align="right">{leaderboard.rating-leaderboard.previous_rating}</TableCell>
                  <TableCell align="right">{leaderboard.highest_rating}</TableCell>
                  <TableCell align="right">{leaderboard.wins}</TableCell>
                  <TableCell align="right">{leaderboard.streak}</TableCell>
                  <TableCell align="right">{leaderboard.games}</TableCell>
                  <TableCell align="right">{leaderboard.drops}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper className={appClasses.box}>
        <Typography variant="body1" noWrap>
          Rating History
        </Typography>
        <div>
          <Rating ratingHistories={profile?.rating_history}/>
        </div>
      </Paper>

      <Paper className={appClasses.box}>
        <div className={classes.row2}>
          <Typography variant="body1" noWrap>
            Matches
          </Typography>
        </div>
        <div>
          {matches?.map(match => <Match key={match.match_id} match={match}/>)}
        </div>
      </Paper>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table" size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Civ</TableCell>
              <TableCell align="right">Games</TableCell>
              <TableCell align="right">Won</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profile?.stats[0].civ.map((statsEntry) => (
                <TableRow key={getCivName(statsEntry.civ)}>
                  <TableCell component="th" scope="row" className={classes.row}>
                    <img src={getCivIconByIndex(statsEntry.civ)} className={classes.civIcon} />
                    {getCivName(statsEntry.civ)}
                  </TableCell>
                  <TableCell align="right">{statsEntry.games}</TableCell>
                  <TableCell align="right">{statsEntry.wins}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  row: {
     display: 'flex',
     alignItems: 'center',
  },
  row2: {
     display: 'flex',
     alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  flagIcon: {
    width: 21,
    height: 15,
    marginRight: theme.spacing(1),
  },
  civIcon: {
    width: 28,
    height: 28,
    marginRight: theme.spacing(1),
  },
  mapIcon: {
    width: 50,
    height: 50,
    marginRight: theme.spacing(1),
  },
  tableContainer: {
    maxWidth: 800,
    marginBottom: theme.spacing(3),
  },
  table: {
    // marginBottom: theme.spacing(3),
    // display: 'flex',
  },
}));

// export default function PostLoader(props) {
//   return <ClientOnly><Post/></ClientOnly>
// }

export default withApollo(Post, {ssr:false})
