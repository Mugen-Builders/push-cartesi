import fetch from 'node-fetch';
import graphqlConfig from './graphql/config.js';
import { noticesQuery, noticeWCursor } from './graphql/queries.js';

let latestCursor = null; // Initialize to 0 or load from persistent storage
let latestProofCursor = null; // Initialize to 0 or load from persistent storage


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

async function pollNoticesWithProof() {
  try {
    const variables = {
      latestCursor: latestProofCursor
    };

    const response = await fetch(graphqlConfig.endpoint, {
        method: 'POST',
        headers: graphqlConfig.headers,
        body: JSON.stringify({ query: noticeWCursor, variables }),
    });

    if (response.ok) {
      const data = await response.json();
      const notices = data.data.notices.edges;

      let noticeList = []
      for (let notice of notices) {
        if (!notice.node.proof) {
          break // In case there is no proof we spot and wait 30 more seconds
        }
        if (notice.node.payload.includes("225f5f707573685f6e6f74696669636174696f6e5f5f223a74727565")) {
          noticeList.push(notice) // Only add here if payload json contains "__push_notification__":true
        }
        latestProofCursor = notice.cursor;
      }
      return noticeList
    } else {
      console.error("GraphQL Error:", data.errors);
    }
  } catch (error) {
    console.error("Network Error:", error);
  }
}

export {
  pollNotices,
  pollNoticesWithProof
}