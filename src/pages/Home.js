import React from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition, Loader } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

function Home() {
  const {
    loading,
    error,
    data
  } = useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid columns={1}>
      <Grid.Row>
        {!error && !loading && data && data.getPosts.length === 0 && <p style={{ fontSize: 28 }}><b><i>No posts yet...</i></b></p>}
        {error && <p style={{ fontSize: 25, color: "red" }}>{error.message}</p>}
        {loading ? (
          <Loader active inline='centered' size='huge' />
        ) : (
          <Transition.Group>
            {data && data.getPosts.length > 0 &&
              data.getPosts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home