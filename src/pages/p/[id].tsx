import Router, { useRouter } from 'next/router'
import { withApollo } from '../../../apollo/client'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {useAppStyles} from "../../components/app-styles";

interface ILeaderboard {
  leaderboard_id: number;
  rating: number;
  games: number;
  drops: number;
}

interface IProfile {
  profile_id: number;
  name: string;
  country: string;
  games: number;
  drops: number;
  leaderboards: ILeaderboard[];
}

interface IProfileQuery {
  profile: IProfile;
}

const ProfileQuery = gql`
  query ProfileQuery($profileId: Int!) {
    profile(profile_id: $profileId) {
      profile_id
      name
      country
      games
      drops
      leaderboards {
        leaderboard_id
        rating
        games
        drops
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

// function useHasMounted() {
//   const [hasMounted, setHasMounted] = React.useState(false);
//   React.useEffect(() => {
//     setHasMounted(true);
//   }, []);
//   return hasMounted;
// }
//
// function ClientOnly({ children, ...delegated }) {
//   const mounted = useHasMounted();
//   const hasId = useRouter().query.id != null;
//   console.log('mounted', mounted);
//   // console.log('router query', useRouter());
//   console.log('router hasId', hasId);
//   if (!mounted || !hasId) return null;
//   return (
//       <div {...delegated}>
//         {children}
//       </div>
//   );
// }

function Post() {
  const appClasses = useAppStyles();


  const [counter, setCounter] = React.useState(0);
  React.useEffect(() => {
    setCounter(1);
  }, []);

  // if (!useHasMounted()) return null;

  const profileId = useRouter().query.id;
  // console.log('router query', useRouter());

  const { loading, error, data } = useQuery<IProfileQuery, any>(ProfileQuery, {
    variables: { profileId: profileId },
    // skip: profileId == null,
    // fetchPolicy: 'no-cache',
  })


  const profile = data?.profile;

  console.log('PROFILE', profileId);
  console.log('DATA', data);

  return (
    <div>
      <Paper className={appClasses.box}>
        <Typography variant="body1" noWrap>
          Profile
        </Typography>
        <Typography variant="subtitle2" noWrap>
          {profileId}
        </Typography>

        <p>loading: {loading}</p>
        <p>error: {error?.message}</p>

        <p>counter: {counter}</p>

        {
          profile &&
          <div>
            <p>
              {profile.country} {profile.name}
            </p>
            <p>
              {profile.games} Games, {profile.drops} Drops ({(profile.drops / profile.games * 100).toFixed(2)} %)
            </p>
          </div>
        }
      </Paper>
    </div>
  )
}

// export default function PostLoader(props) {
//   return <ClientOnly><Post/></ClientOnly>
// }

export default withApollo(Post, {ssr:false})
