import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import {withApollo} from "../../apollo/client";
import {Icon, InputBase, Paper} from "@material-ui/core";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrophy, faLandmark, faFistRaised, faFlask, faUser} from '@fortawesome/free-solid-svg-icons'

import Link from "../components/link";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        backgroundColor: 'white',
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    toolbarPadding: {
        // paddingLeft: 24,
        // paddingRight: 24,
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        alignItems: 'center',
        display: 'flex',
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    mainIcon: {
        width: 28,
        height: 28,
        marginRight: theme.spacing(1),
    },
    mainText: {
        marginTop: 2,
    },
    iconContainer: {
        width: 30,
        justifyContent: 'center',
        display: 'flex',
    },
    icon: {
        fontSize: 18,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
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
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

// https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/

function Layout(props) {
    const {children} = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <div className={classes.toolbar + ' ' + classes.toolbarPadding}>
                <img src="/icon.png" alt="my image" className={classes.mainIcon} />
                <Typography variant="body1" className={classes.mainText} noWrap>
                    AoE II Companion
                </Typography>
            </div>
            <Divider />
            <List>
                {/*<ListItem button component={Link as any} href='/profile/[id]' as={`/profile/886872`} naked>*/}
                <ListItem button component={Link as any} href='/profile/[id]' as={`/profile/251265`} naked>
                    <ListItemIcon><div className={classes.iconContainer}><FontAwesomeIcon icon={faUser} className={classes.icon} /></div></ListItemIcon>
                    <ListItemText primary="Me" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button component={Link as any} href="/" naked>
                    <ListItemIcon><div className={classes.iconContainer}><FontAwesomeIcon icon={faTrophy} className={classes.icon} /></div></ListItemIcon>
                    <ListItemText primary="Leaderboard" />
                </ListItem>
            </List>
            {/*<Divider />*/}
            {/*<List>*/}
            {/*    <ListItem button component={Link as any} href='/profile/[id]' as={`/profile/886872`} naked>*/}
            {/*        <ListItemIcon><div className={classes.iconContainer}><FontAwesomeIcon icon={faLandmark} className={classes.icon} /></div></ListItemIcon>*/}
            {/*        <ListItemText primary="Civs" />*/}
            {/*    </ListItem>*/}
            {/*    <ListItem button component={Link as any} href="/o/886872" naked>*/}
            {/*        <ListItemIcon><div className={classes.iconContainer}><FontAwesomeIcon icon={faFistRaised} className={classes.icon} /></div></ListItemIcon>*/}
            {/*        <ListItemText primary="Units" />*/}
            {/*    </ListItem>*/}
            {/*    <ListItem button component={Link as any} href="/about" naked>*/}
            {/*        <ListItemIcon><div className={classes.iconContainer}><FontAwesomeIcon icon={faFlask} className={classes.icon} /></div></ListItemIcon>*/}
            {/*        <ListItemText primary="Techs" />*/}
            {/*    </ListItem>*/}
            {/*</List>*/}
        </div>
    );

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar} color="transparent">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>

                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>

                    {/*<Typography variant="h6" noWrap>*/}
                    {/*    Responsive drawer*/}
                    {/*</Typography>*/}
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />

                {children}
            </main>
        </div>
    );
}

export default Layout
