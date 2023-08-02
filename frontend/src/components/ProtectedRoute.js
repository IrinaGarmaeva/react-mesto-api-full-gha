import React from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ isLoggedIn, element }) {
  return(
    isLoggedIn ? element : <Navigate to="sign-in" replace />
  )
}
