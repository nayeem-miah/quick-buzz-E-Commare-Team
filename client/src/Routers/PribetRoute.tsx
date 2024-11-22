import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'

import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../Hooks/UseAuth'
import LoadingSpinner from '../Shared/Loading'


interface PrivateRouteProps {
  children: ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingSpinner />
  if (user) return <>{children}</>
  return <Navigate to='/login' state={{ from: location.pathname }} replace />
}

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
}

export default PrivateRoute
