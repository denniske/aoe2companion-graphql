import {useQuery} from "@apollo/client";
import React from "react";
import {fade, InputBase, Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Match from "./match";
import {useAppStyles} from "./app-styles";
import {makeStyles} from "@material-ui/core/styles";
import gql from "graphql-tag";
import {IMatch} from "../../util/api.types";
import {maps} from "../helper/maps";


const MatchesQuery = gql`
    query MatchesQuery($profileId: Int!, $leaderboardId: Int!, $search: String) {
        matches(
            start: 0,
            count: 5,
            profile_id: $profileId,
            leaderboard_id: $leaderboardId
            search: $search
        ) {
            total
            matches {
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
    }
`

interface IMatchList {
    total: number;
    matches: IMatch[];
}

interface IMatchesQuery {
    matches: IMatchList;
}

interface Props {
    profileId: string;
}

export default function ProfileMatches({profileId}: Props) {
    const appClasses = useAppStyles();
    const classes = useStyles();

    const [text, setText] = React.useState('');
    const [leaderboardId, setLeaderboardId] = React.useState('3');

    const matchesResult = useQuery<IMatchesQuery, any>(MatchesQuery, {
        variables: {
            profileId: parseInt(profileId),
            leaderboardId: parseInt(leaderboardId),
            search: text,
            map_types: Object.entries(maps).filter(([map_type, name]) => name.toLowerCase().indexOf(text.toLowerCase()) >= 0).map(([map_type, name]) => map_type),
        },
        skip: profileId == null,
        fetchPolicy: 'network-only',
    })

    const total = matchesResult.data?.matches.total;
    const matches = matchesResult.data?.matches.matches;

    // console.log('total', total);
    console.log('matches', matches);

    return (
        <Paper className={appClasses.box}>
            <div className={classes.row2}>
                <Typography variant="body1" noWrap>
                    Matches {matchesResult.loading ? 'loading' : 'ready'}
                </Typography>
            </div>

            <div className={classes.row3}>
                <ToggleButtonGroup value={leaderboardId} exclusive onChange={(e, v) => setLeaderboardId(v)} size="small">
                    <ToggleButton value="3">
                        <div className={classes.option}>Random Map 1v1</div>
                    </ToggleButton>
                    <ToggleButton value="4">
                        <div className={classes.option}>Random Map Team</div>
                    </ToggleButton>
                    <ToggleButton value="1">
                        <div className={classes.option}>Death Match 1v1</div>
                    </ToggleButton>
                    <ToggleButton value="2">
                        <div className={classes.option}>Death Match Team</div>
                    </ToggleButton>
                    <ToggleButton value="0">
                        <div className={classes.option}>Unranked</div>
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

            <Paper className={classes.searchRow}>
                {/*<div className={classes.searchIcon}>*/}
                {/*  <SearchIcon/>*/}
                {/*</div>*/}
                <InputBase
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Search by name, map, player…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{'aria-label': 'search'}}
                />
            </Paper>

            <div style={{opacity: matchesResult.loading ? 0.7 : 1}}>
                <div className={classes.row3}>
                    {total} matches
                </div>
                <div>
                    {matches?.map(match => <Match key={match.match_id} match={match}/>)}
                </div>
            </div>
        </Paper>
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

    option: {
        padding: theme.spacing(0, 1),
    },
    row3: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    searchRow: {
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(0, -3, 2, -3),
        backgroundColor: fade(theme.palette.common.black, 0.00),
    },
    searchIcon: {
        padding: theme.spacing(0, 2, 0, 2),
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        // backgroundColor: 'yellow',
        flex: 1,
    },
    inputInput: {
        padding: theme.spacing(2, 3, 2, 3),
        display: 'flex',
        // flex: 1,
        // backgroundColor: 'pink',
        // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        // width: '100%',
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
        marginBottom: theme.spacing(3),
        marginRight: theme.spacing(3),
    },
}));
