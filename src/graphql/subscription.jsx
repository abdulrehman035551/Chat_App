
export const ADD_MESSAGE_SUBSCRIPTION =`
  subscription AddMessage {
    addMessage {
      messageId
      body
      createdAt
      handle
    }
  }
`;
