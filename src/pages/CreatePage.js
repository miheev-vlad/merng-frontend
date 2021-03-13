import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import PostForm from '../components/PostForm';

function CreatePage() {
  const { user } = useContext(AuthContext);

  return (
    <Grid columns={1}>
      <Grid.Row className="page-title">
        <h1>Create Post</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default CreatePage