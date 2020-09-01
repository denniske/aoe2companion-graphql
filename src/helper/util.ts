import {format, fromUnixTime} from "date-fns";
import {enUS} from "date-fns/locale";

export function parseUnixTimestamp(timestamp: number) {
    return fromUnixTime(timestamp);
}

export function formatDateShort(date: Date) {
    return format(date, 'MMM d', {locale: enUS});
}


const leaderboardColors = [
    '#757476',
    '#D65154',
    '#E19659',
    '#6188C1',
    '#8970AE',
];

const darkLeaderboardColors = [
    '#8e8e8e',
    '#D65154',
    '#E19659',
    '#6188C1',
    '#8970AE',
];

export function getLeaderboardColor(leaderboard_id: number, darkMode: boolean) {
    const colors = darkMode ? darkLeaderboardColors : leaderboardColors;
    return colors[leaderboard_id];
}


const leaderboardTextColors = [
    '#525152',
    '#c52026',
    '#ff943d',
    '#5084d3',
    '#8560be',
];

const darkLeaderboardTextColors = [
    '#8e8e8e',
    '#c52026',
    '#ff943d',
    '#5084d3',
    '#8560be',
];

export function getLeaderboardTextColor(leaderboard_id: number, darkMode: boolean) {
    const colors = darkMode ? darkLeaderboardTextColors : leaderboardTextColors;
    return colors[leaderboard_id];
}

export enum LeaderboardId {
    Unranked = 0,
    DM1v1 = 1,
    DMTeam = 2,
    RM1v1 = 3,
    RMTeam = 4,
}

export const leaderboardList: LeaderboardId[] = [3, 4, 1, 2, 0];

const abbreviations = ['Unranked', 'DM 1v1', 'DM Team', 'RM 1v1', 'RM Team'];

export function formatLeaderboardId(leaderboard_id: LeaderboardId) {
    return abbreviations[leaderboard_id];
}