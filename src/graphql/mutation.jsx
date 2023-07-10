const CREATE_MESSAGE = `
  mutation CreateMessage($body: String!) {
    createMessage(body: $body) {
      body
    }
  }
`;
export default CREATE_MESSAGE