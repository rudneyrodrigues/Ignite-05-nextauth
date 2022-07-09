import { NextPage } from "next";

import { useAuth } from "../context/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

const Dashboard: NextPage = () => {
  const { user, isAuthenticated } = useAuth();

  const useCanSeeMetrics = useCan({
    permissions: ["metrics.list"],
    roles: ["editor", "administrator"],
  });

  return (
    <div>
      <h1>{user?.email}</h1>

      {useCanSeeMetrics && (
        <>
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
        </>
      )}

      {isAuthenticated ? <p style={{
        marginTop: "1rem",
      }}>Está autenticado</p> : <p style={{
        marginTop: "1rem",
      }}>Não esta autenticado</p>}
    </div>
  )
}

export default Dashboard;

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/me');

  return {
    props: {},
  };
})
