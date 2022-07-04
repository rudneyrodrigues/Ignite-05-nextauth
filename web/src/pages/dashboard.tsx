import { NextPage } from "next";
import { useEffect } from "react";

import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const Dashboard: NextPage = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    api.get('/me')
    .then(response => console.log(response))
    .catch(error => console.log(error));
  }, [])

  return (
    <div>
      <h1>{user?.email}</h1>

      <div style={{
        marginTop: "1rem",
      }}>
        {user?.permissions.map((permission) => {
          return <p key={permission}>{permission}</p>;
        })}
      </div>

      <div style={{
        marginTop: "1rem",
      }}>
        {user?.roles.map((role) => {
          return <p key={role}>{role}</p>;
        })}
      </div>
      {isAuthenticated ? <p style={{
        marginTop: "1rem",
      }}>Está autenticado</p> : <p style={{
        marginTop: "1rem",
      }}>Não esta autenticado</p>}
    </div>
  )
}

export default Dashboard;
