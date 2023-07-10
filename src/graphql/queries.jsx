export const GET_MESSAGES= `
  query getMessages($filter: String!) {
    getMessages(filter: $filter) {
      messageId,
      body,
      createdAt,
      handle,
    
    }
  }
`;