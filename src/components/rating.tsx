import React from 'react';
import {VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme} from "victory";
import {
    formatDateShort, formatLeaderboardId, getLeaderboardColor, getLeaderboardTextColor, parseUnixTimestamp
} from "../helper/util";
import {makeStyles} from "@material-ui/core/styles";
import useDimensions from "../hooks/use-dimensions";
import {IRatingHistory} from "../helper/types";

interface IRatingProps {
    ratingHistories: IRatingHistory[];
}

function replaceRobotoWithSystemFont(obj: any) {
    const keys = Object.keys(obj);
    keys.forEach(function(key) {
        const value = obj[key];
        if (key === 'fontFamily') {
            obj[key] = obj[key].replace("'Roboto',", "'System',");
        }
        if (typeof value === 'object') {
            replaceRobotoWithSystemFont(obj[key]);
        }
    });
    return obj;
}

export default function Rating({ratingHistories}: IRatingProps) {
    const classes = useStyles();
    const paperTheme = { dark: false };

    // console.log('VictoryTheme.material', VictoryTheme.material);

    // let themeWithSystemFont = replaceRobotoWithSystemFont({...VictoryTheme.material});
    //
    // const themeCustomizations = {
    //     axis: {
    //         style: {
    //             tickLabels: {
    //                 // fill: appTheme.textColor,
    //             },
    //         },
    //     },
    // };
    //
    // themeWithSystemFont = merge(themeWithSystemFont, themeCustomizations);

    // We need to supply our custom tick formatter because otherwise victory native will
    // print too much ticks on the x-axis.
    const formatTick = (tick: any, index: number, ticks: any[]) => {
        return formatDateShort(parseUnixTimestamp(ticks[index]/1000));
    };

    const [measureRef, { width }] = useDimensions();
    // console.log('WIDTH', width);
    // const [size, onLayout] = useComponentSize();
    // console.log('size', size);

    return (
            <div className={classes.container}>
                <div ref={measureRef}>
                                <VictoryChart
                                    // width={200} height={150}
                                    // width={900} height={300}
                                    width={width} height={300}
                                    theme={VictoryTheme.material}
                                    padding={{left: 50, bottom: 30, top: 20, right: 20}}
                                    // containerComponent={
                                    //     <VictoryZoomContainer key={'zoom'}/>
                                    // }
                                >
                                    <VictoryAxis crossAxis tickFormat={formatTick} tickCount={width ? Math.round(width/60) : 100} />
                                    {/*<VictoryAxis crossAxis />*/}
                                    <VictoryAxis dependentAxis crossAxis/>
                                    {
                                        ratingHistories?.map(ratingHistory => (
                                            <VictoryLine
                                                name={'line-' + ratingHistory.leaderboard_id}
                                                key={'line-' + ratingHistory.leaderboard_id}
                                                data={ratingHistory.history}
                                                x="timestamp"
                                                y="rating" style={{
                                                data: {stroke: getLeaderboardColor(ratingHistory.leaderboard_id, paperTheme.dark)}
                                            }}
                                            />
                                        ))
                                    }
                                    {
                                        ratingHistories?.map(ratingHistory => (
                                            <VictoryScatter
                                                name={'scatter-' + ratingHistory.leaderboard_id}
                                                key={'scatter-' + ratingHistory.leaderboard_id}
                                                data={ratingHistory.history}
                                                x="timestamp"
                                                y="rating"
                                                size={1.5}
                                                style={{
                                                    data: {fill: getLeaderboardColor(ratingHistory.leaderboard_id, paperTheme.dark)}
                                                }}
                                            />
                                        ))
                                    }
                                </VictoryChart>
                </div>
                <div className={classes.legend}>
                    {
                        (ratingHistories || Array(2).fill(0)).map((ratingHistory, i) => (
                            <span
                                key={'legend-' + i}
                                style={{
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                    // fontSize: 12,
                                    color: getLeaderboardTextColor(ratingHistory.leaderboard_id, paperTheme.dark)
                                }}
                            >
                                {formatLeaderboardId(ratingHistory.leaderboard_id)}
                            </span>
                        ))
                    }
                </div>
            </div>
    )
}


const useStyles = makeStyles((theme) => ({
    chart: {
        backgroundColor: 'yellow',
        width: '100%',
    },
    durationRow: {
        // backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'center',
        // justifyContent: 'flex-end',
        marginBottom: 10,
    },
    container: {
        // backgroundColor: 'green',
        position: "relative"
    },
    legend: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        marginHorizontal: -8,
        marginTop: 10,
        // backgroundColor: 'red',
    },
    legendDesc: {
        textAlign: 'center',
        fontSize: 12
    },
}));
