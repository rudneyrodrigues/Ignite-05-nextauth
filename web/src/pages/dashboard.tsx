import { NextPage } from "next";

import { Can } from "../components/Can";
import { useAuth } from "../context/AuthContext";
import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

const Dashboard: NextPage = () => {
  const { user, signOut, broadcastAuth } = useAuth();

  function handleSignOut() {
    broadcastAuth.current.postMessage("signOut");
    signOut();
  }

  return (
    <div>
      <h1>{user?.email}</h1>

      <button onClick={handleSignOut}>Sign out</button>

      <Can permissions={['metrics.list']} roles={["editor", "administrator"]}>
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
      </Can>
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
