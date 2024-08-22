const noticesQuery = `
    query notices {
        notices {
            edges {
                node {
                    index
                    input {
                        index
                    }
                    payload
                }
            }
        }
    }
`

const noticeWCursor = `
    query notices($latestCursor: String) {
        notices(after: $latestCursor) {
            edges {
                node {
                    index
                    input {
                        index
                        timestamp
                    }
                    proof {
                        context
                    }
                    payload
                }
                cursor
            }
            pageInfo {
                hasNextPage
                endCursor
            }
        }
    }
`

export { 
    noticesQuery,
    noticeWCursor
}