import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FETCH_POSTS_QUERY } from './graphql';

export const getData = () => {
  const {
    loading,
    error,
    data
  } = useQuery(FETCH_POSTS_QUERY);
  return { loading, error, data }
}