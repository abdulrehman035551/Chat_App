import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify, Auth } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_EaEjQa1Ev",
    userPoolWebClientId: "1ua5577la221r6s451qpleq7h9",
    mandatorySignIn: true,
  },
});

const myAppConfig = {
  'aws_appsync_graphqlEndpoint': 'https://zazwced34nby3elastjym3gwzy.appsync-api.us-east-1.amazonaws.com/graphql',
  'aws_appsync_region': 'us-east-1',
  'aws_appsync_authenticationType': 'AMAZON_COGNITO_USER_POOLS'
}
Amplify.configure(myAppConfig)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


reportWebVitals();
