import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

import Home from './pages/Home.js';
import Tutorial from './pages/Tutorial.js';
import InstructionsFirstTime from './pages/InstructionsFirstTime.js';
import InstructionsWelcomeBack from './pages/InstructionWelcomeBack.js';
import Experiment from './pages/Experiment.js';
import ThankYouMessage from './components/ThankYouMessage.js';

import 'normalize.css'
import './styles/global.css';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "instructions/",
    element: <InstructionsFirstTime />,
  },
  {
    path: "welcome-back/",
    element: <InstructionsWelcomeBack />,
  },
  {
    path: "experiment/",
    element: <Experiment />,
  },
  {
    path: "thank-you/",
    element: <ThankYouMessage />,
  },
  {
    path: "tutorial/",
    element: <Tutorial />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
      <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();