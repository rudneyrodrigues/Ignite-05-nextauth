import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

// Exportamos uma função que recebe como parâmetro o contexto do SSR, e retorna
// uma nova função a ser executada pelo SSR.
// Sempre que precisarmos verificar se o usuário está logado,
// podemos usar essa função por volta da função de SSR.
export const withSSRGuest = <P>(fn: GetServerSideProps<P>):GetServerSideProps => {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    // Esta função fará a verificação do usuário, e se estiver logado,
    // será redirecionado para a página de dashboard.
    const cookies = parseCookies(ctx);

    if (cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      }
    }

    // Se o usuário não estiver logado, será executado a função de SSR que foi,
    // passada como parâmetro.
    return await fn(ctx);
  }
}
