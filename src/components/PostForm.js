import React, { useEffect, useState } from 'react';
import { Button, Form, Loader } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useForm } from '../utils/hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import { useHistory } from 'react-router';

function PostForm() {
  const history = useHistory();
  const [imgUrl, setImgUrl] = useState('');
  const [load, setLoad] = useState(false);
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });
  const handleUploadImg = (img) => {
    setLoad(true);
    const data = new FormData();
    data.append('file', img);
    data.append('upload_preset', 'city-suggestions');
    data.append('cloud_name', 'cloudinary-img-app');
    fetch('https://api.cloudinary.com/v1_1/cloudinary-img-app/image/upload', {
      method: 'POST',
      body: data
    })
      .then((res) => res.json())
      .then((data) => {
        setLoad(false);
        setImgUrl(data.url);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
      })
  }
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      history.push(`/posts/${result.data.createPost["id"]}`);
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.body = '';
    }
  });
  function createPostCallback() {
    createPost();
  }
  const onSubmitHandler = (event) => {
    event.preventDefault();
    onSubmit();
  }
  useEffect(() => {
    values.imageUrl = imgUrl
  }, [imgUrl, values])
  return (
    <>
      <Form onSubmit={onSubmitHandler}>
        <h2>Post creation form:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Post title..."
            name="title"
            onChange={onChange}
            value={values.title}
            error={error ? true : false}
            required
          />
          <Form.Input
            placeholder="Post text..."
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
            required
          />
          <Button as="label" htmlFor="file" type="button">
            Upload Image
          </Button>
          <input type="file" id="file" hidden onChange={(e) => handleUploadImg(e.target.files[0])} required/>
          {!imgUrl && !load && <p style={{ fontSize: 18, color: "red" }}><i>You need to upload a picture!</i></p>}
          {load && <Loader active inline='centered' size='medium' />}
          {imgUrl && <p>Image Url: {imgUrl}</p>}
          {false && <Form.Input
            placeholder="Post image..."
            name="imageUrl"
            style={{ display: "hidden" }}
            onChange={onChange}
            value={values.imageUrl}
            error={error ? true : false}
          />}
          <br />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String! $title: String! $imageUrl: String!) {
    createPost(body: $body, title: $title, imageUrl: $imageUrl) {
      id
      body
      title
      imageUrl
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;