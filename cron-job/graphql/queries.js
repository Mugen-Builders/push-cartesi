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
`;

export { 
    noticesQuery
}