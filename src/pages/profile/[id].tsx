import Router, { useRouter } from 'next/router'
import { withApollo } from '../../../apollo/client'
import gql from 'graphql-tag'
import {
  Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, AppBar, Tabs, Box, Tab, TablePagination,
  InputBase, fade
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React, {useEffect} from "react";
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
import Match from "../../components/match";
import {getMapImage, getMapName} from "../../helper/maps";
import Link from "next/link";
import SearchIcon from '@material-ui/icons/Search';

import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


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
          country
        }
        opponents {
          name
          games
          wins
          country
          profile_id
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
      leaderboard_id: 4
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
      >
        {value === index && (
            <Box p={3}>
              <Typography>{children}</Typography>
            </Box>
        )}
      </div>
  );
}


function Post() {
  const appClasses = useAppStyles();
  const classes = useStyles();
  const profileId = useRouter().query.id as string;

  const [value, setValue] = React.useState(0);
  const [filteredOpponents, setFilteredOpponents] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    setFilteredOpponents(profile?.stats[0].opponents.filter((x, i) => i > page * 10 && i < (page+1)*10));
  }, [page]);

  const [alignment, setAlignment] = React.useState('left');

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const profileResult = useQuery<IProfileQuery, any>(ProfileQuery, {
    variables: {profileId: parseInt(profileId)},
    skip: profileId == null,
  })

  const matchesResult = useQuery<IMatchesQuery, any>(MatchesQuery, {
    variables: {profileId: parseInt(profileId)},
    skip: profileId == null,
  })

  const profile = profileResult.data?.profile;
  const matches = matchesResult.data?.matches;

  console.log('matches', matches);


  const values: number[] = [
    3,
    4,
    1,
    2,
    0,
  ];

  const valueMapping: any = {
    0: {
      title: 'UNR',
      subtitle: 'Unranked',
    },
    3: {
      title: 'RM',
      subtitle: '1v1',
    },
    4: {
      title: 'RM',
      subtitle: 'Team',
    },
    1: {
      title: 'DM',
      subtitle: '1v1',
    },
    2: {
      title: 'DM',
      subtitle: 'Team',
    },
  };

  const renderLeaderboard = (value: any, selected: boolean) => {
    return (
      <div className={classes.col}>
        <div className={classes.h1} style={{ fontWeight: selected ? 'bold' : 'normal'}}>{valueMapping[value].title}</div>
        <div className={classes.h2} style={{ fontWeight: selected ? 'bold' : 'normal'}}>{valueMapping[value].subtitle}</div>
      </div>
    );
  };

  return (
      <div className={classes.container}>
        <div className={classes.containerLine}>
          <Paper className={appClasses.box}>
            {
              profile &&
              <div>
                <div className={classes.row2}>
                  <img src={getFlagIcon(profile.country)} className={classes.flagIcon}/>
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
                      <TableCell align="right">{leaderboard.rating - leaderboard.previous_rating}</TableCell>
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

          {/*<Paper className={appClasses.box}>*/}
          {/*  <Typography variant="body1" noWrap>*/}
          {/*    Rating History*/}
          {/*  </Typography>*/}
          {/*  <div>*/}
          {/*    <Rating ratingHistories={profile?.rating_history}/>*/}
          {/*  </div>*/}
          {/*</Paper>*/}

          <Paper className={appClasses.box}>

            {/*<AppBar position="static">*/}
            {/*  <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">*/}
            {/*    <Tab label="RM 1v1" />*/}
            {/*    <Tab label="RM Team" />*/}
            {/*    <Tab label="DM 1v1" />*/}
            {/*    <Tab label="DM Team" />*/}
            {/*    <Tab label="Unranked" />*/}
            {/*  </Tabs>*/}
            {/*</AppBar>*/}
            {/*<TabPanel value={value} index={0}>*/}
            {/*  Item One*/}
            {/*</TabPanel>*/}
            {/*<TabPanel value={value} index={1}>*/}
            {/*  Item Two*/}
            {/*</TabPanel>*/}
            {/*<TabPanel value={value} index={2}>*/}
            {/*  Item Three*/}
            {/*</TabPanel>*/}

            <div className={classes.row2}>
              <Typography variant="body1" noWrap>
                Matches
              </Typography>
            </div>
            <div className={classes.row2}>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon/>
                </div>
                <InputBase
                    placeholder="Search by name, map, player…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{'aria-label': 'search'}}
                />
              </div>

              <ToggleButtonGroup
                  value={alignment}
                  exclusive
                  onChange={handleAlignment}
                  aria-label="text alignment"
              >
                <ToggleButton value="left" aria-label="left aligned">
                  {renderLeaderboard(0, false)}
                </ToggleButton>
                <ToggleButton value="center" aria-label="centered">
                  {renderLeaderboard(1, false)}
                </ToggleButton>
                <ToggleButton value="right" aria-label="right aligned">
                  {renderLeaderboard(2, false)}
                </ToggleButton>
                <ToggleButton value="justify" aria-label="justified" disabled>
                  {renderLeaderboard(3, false)}
                </ToggleButton>
              </ToggleButtonGroup>

            </div>
            <div>
              <Rating ratingHistories={profile?.rating_history}/>
            </div>
            <div>
              {matches?.map(match => <Match key={match.match_id} match={match}/>)}
            </div>
          </Paper>
        </div>
        <div className={classes.containerLine}>

          {
            false &&
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table className={classes.table} aria-label="simple table" size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Ally</TableCell>
                    <TableCell align="right">Games</TableCell>
                    <TableCell align="right">Won</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profile?.stats[0].allies.map((statsEntry) => (
                      <TableRow key={statsEntry.name}>
                        <TableCell component="th" scope="row" className={classes.row}>
                          <img src={getFlagIcon(statsEntry.country)} className={classes.flagIcon}/>
                          {statsEntry.name}
                        </TableCell>
                        <TableCell align="right">{statsEntry.games}</TableCell>
                        {/*<TableCell align="right">{statsEntry.wins}</TableCell>*/}
                        <TableCell align="right">{(statsEntry.wins / statsEntry.games * 100).toFixed(0)} %</TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          }

          {/*<TableContainer component={Paper} className={classes.tableContainer}>*/}
          {/*  <Table className={classes.table} aria-label="simple table" size="medium">*/}
          {/*    <TableHead>*/}
          {/*      <TableRow>*/}
          {/*        <TableCell>Opponent</TableCell>*/}
          {/*        <TableCell align="right">Games</TableCell>*/}
          {/*        <TableCell align="right">Won</TableCell>*/}
          {/*      </TableRow>*/}
          {/*    </TableHead>*/}
          {/*  </Table>*/}
          {/*</TableContainer>*/}

          <Paper className={appClasses.boxForTable}>
            <TableContainer className={classes.tableContainer}>
              <Table className={classes.table} aria-label="simple table" size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Opponent</TableCell>
                    <TableCell align="right">Games</TableCell>
                    <TableCell align="right">Won</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOpponents?.map((statsEntry) => (
                      <TableRow key={statsEntry.name}>
                        <TableCell component="th" scope="row" className={classes.row}>
                          <Link href='/profile/[id]' as={`/profile/${statsEntry.profile_id}`}>
                            <div className={classes.rowLink2}>
                              <img src={getFlagIcon(statsEntry.country)} className={classes.flagIcon}/>
                              {statsEntry.name}
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell align="right">{statsEntry.games}</TableCell>
                        {/*<TableCell align="right">{statsEntry.wins}</TableCell>*/}
                        <TableCell align="right">{(statsEntry.wins / statsEntry.games * 100).toFixed(0)} %</TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/*<TablePagination*/}
            {/*    rowsPerPageOptions={[10, 25, 100]}*/}
            {/*    component="div"*/}
            {/*    count={profile?.stats[0].opponents.length}*/}
            {/*    rowsPerPage={rowsPerPage}*/}
            {/*    page={page}*/}
            {/*    onChangePage={handleChangePage}*/}
            {/*    onChangeRowsPerPage={handleChangeRowsPerPage}*/}
            {/*/>*/}
          </Paper>

          <div className={classes.containerWrap}>
            <div className={classes.containerWrap50}>

              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table} aria-label="simple table" size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Civ</TableCell>
                      <TableCell align="right">Games</TableCell>
                      {/*<TableCell align="right"></TableCell>*/}
                      <TableCell align="right">Won</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profile?.stats[0].civ.map((statsEntry) => (
                        <TableRow key={getCivName(statsEntry.civ)}>
                          <TableCell component="th" scope="row" className={classes.row}>
                            <img src={getCivIconByIndex(statsEntry.civ)} className={classes.civIcon}/>
                            {getCivName(statsEntry.civ)}
                          </TableCell>
                          <TableCell align="right">{statsEntry.games}</TableCell>
                          {/*<TableCell align="right">{statsEntry.wins}</TableCell>*/}
                          <TableCell align="right">{(statsEntry.wins / statsEntry.games * 100).toFixed(0)} %</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className={classes.containerWrap50b}>
              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table} aria-label="simple table" size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Map</TableCell>
                      <TableCell align="right">Games</TableCell>
                      <TableCell align="right">Won</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profile?.stats[0].map_type.map((statsEntry) => (
                        <TableRow key={getMapName(statsEntry.map_type)}>
                          <TableCell component="th" scope="row" className={classes.row}>
                            <img src={getMapImage(statsEntry.map_type)} className={classes.mapIcon}/>
                            {getMapName(statsEntry.map_type)}
                          </TableCell>
                          <TableCell align="right">{statsEntry.games}</TableCell>
                          {/*<TableCell align="right">{statsEntry.wins}</TableCell>*/}
                          <TableCell align="right">{(statsEntry.wins / statsEntry.games * 100).toFixed(0)} %</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>


        </div>
      </div>
  );
}

const useStyles = makeStyles((theme) => ({
  col: {
    paddingHorizontal: 7,
    alignItems: 'center',
  },
  h1: {

  },
  h2: {
    fontSize: 11,
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2, 0, 0),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '25ch',
    },
  },

  containerWrap: {
     display: 'flex',
     flexDirection: 'row',
     flexWrap: 'wrap',
     maxWidth: 800,
  },
  containerWrap50: {
     flex: 1,
  },
  containerWrap50b: {
     flex: 1,
     marginLeft: theme.spacing(3),
  },
  container: {
     display: 'flex',
     flexDirection: 'column',
     // flexWrap: 'wrap',
  },
  containerLine: {
     display: 'flex',
     flexDirection: 'column',
  },
  row: {
     display: 'flex',
     alignItems: 'center',
  },
  rowLink2: {
    '&:hover': {
      // background: "#EEE",
      textDecoration: 'underline',
    },
    // padding: 3,
    cursor: 'pointer',
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
    width: 28,
    height: 28,
    marginRight: theme.spacing(1),
  },
  tableContainer: {
    maxWidth: 800,
    // maxHeight: 500,
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  table: {
    // marginBottom: theme.spacing(3),
    // display: 'flex',
  },
}));

export default withApollo(Post, {ssr:false})
