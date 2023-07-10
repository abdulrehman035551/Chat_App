import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { GET_MESSAGES } from './graphql/queries';
import CREATE_MESSAGE from './graphql/mutation';
import { ADD_MESSAGE_SUBSCRIPTION } from './graphql/subscription';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    async function fetchMessages() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const username = user.username;

        const response = await API.graphql(graphqlOperation(GET_MESSAGES, { filter: username }));
        const fetchedMessages = response.data.getMessages;
        setMessages(fetchedMessages);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMessages();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(ADD_MESSAGE_SUBSCRIPTION)).subscribe({
      next: (result) => {
        console.log('subscription', result);
        const { data } = result.value;
        const receivedMessage = {
          id: data.addMessage.messageId,
          body: data.addMessage.body,
          handle: data.addMessage.handle,
        };

        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      },
      error: (error) => {
        console.error('Subscription error:', error);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function createMessage(newMessage) {
    try {
      const response = await API.graphql(graphqlOperation(CREATE_MESSAGE, { body: newMessage }));
      const createdMessage = response.data.createMessage;

      // setMessages((prevMessages) => [...prevMessages, createdMessage]);
      setNewMessage('');
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(event) {
    setNewMessage(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (newMessage.trim() !== '') {
      await createMessage(newMessage);
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="main">
          <h1 className="heading">Chat App</h1>
          <button onClick={signOut} className="sign-out-button">
            Sign Out
          </button>

          <div className="chat-container">
            <div className="message-list">
              <ul>
                {messages.map((message) => (
                  <li
                    key={message.id}
                    className={message.handle === user.username ? 'message-item own-message' : 'message-item'}
                  >
                    <div className="message-content">{message.body}</div>
                    <div className="message-sender">{message.handle}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="message-input">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Type a message..."
                />
                <button type="submit" className="send-button">Send</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Authenticator>
  );
}

export default withAuthenticator(App);
