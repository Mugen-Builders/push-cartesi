import fetch from 'node-fetch';
import graphqlConfig from './graphql/config.js';
import { noticesQuery, noticeWCursor } from './graphql/queries.js';

let latestCursor = null; // Initialize to 0 or load from persistent storage

async function pollNotices() {
  try {
    const variables = {
      latestCursor: latestCursor
    };

    const response = await fetch(graphqlConfig.endpoint, {
        method: 'POST',
        headers: graphqlConfig.headers,
        body: JSON.stringify({ query: noticeWCursor, variables }),
    });

    if (response.ok) {
      const data = await response.json();
      const notices = data.data.notices.edges;

      notices.forEach(notice => {
        latestCursor = notice.cursor;
      })
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