import {makeStyles} from "@material-ui/core/styles";

export const useAppStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    box: {
        padding: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
}));
