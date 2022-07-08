import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

// Exportamos uma função que recebe como parâmetro o contexto do SSR, e retorna
// uma nova função a ser executada pelo SSR.
// Sempre que precisarmos verificar se o usuário está logado,
// podemos usar essa função por volta da função de SSR.
export const withSSRAuth = <P>(fn: GetServerSideProps<P>):GetServerSideProps => {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    // Esta função fará a verificação do usuário, e se estiver logado,
    // será redirecionado para a página de dashboard.
    const cookies = parseCookies(ctx);

    if (!cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    // Se o usuário não estiver logado, será executado a função de SSR que foi,
    // passada como parâmetro.
    try {
      return await fn(ctx);
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, 'nextauth.token');
        destroyCookie(ctx, 'nextauth.refreshToken');
        
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
    }
  }
}
