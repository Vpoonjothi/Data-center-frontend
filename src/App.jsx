import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
// Routes are managed in src/app/router/index.jsx

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
