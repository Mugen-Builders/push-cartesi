import fetch from 'node-fetch';
import graphqlConfig from './graphql/config.js';
import { noticesQuery } from './graphql/queries.js';

async function pollNotices() {
  try {
    const response = await fetch(graphqlConfig.endpoint, {
      method: 'POST',
      headers: graphqlConfig.headers,
      body: JSON.stringify({ query: noticesQuery }),
    });

    const data = await response.json();
    if (response.ok) {
      // console.log("Fetched Notices:", data.data.notices.edges);
      return data.data.notices.edges
    } else {
      console.error("GraphQL Error:", data.errors);
    }
  } catch (error) {
    console.error("Network Error:", error);
  }
}

export {
  pollNotices
}