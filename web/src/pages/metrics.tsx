import { NextPage } from "next";
import decode from 'jwt-decode';

import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

const Metrics: NextPage = () => {
  return (
    <>
      <h1>Metrics</h1>
    </>
  )
}

export default Metrics;

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/me');

  return {
    props: {},
  };
}, {
  permissions: ['metrics.list'],
  roles: ['administrator'],
})
