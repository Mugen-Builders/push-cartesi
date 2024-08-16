const graphqlConfig = {
    endpoint: 'http://localhost:8080/graphql',
    headers: {
        'Content-Type': 'application/json',
        // You can add authentication tokens or other headers here if needed
        // 'Authorization': `Bearer YOUR_TOKEN_HERE`,
    }
};

export default graphqlConfig;