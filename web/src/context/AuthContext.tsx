import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { api } from "../services/api";

// Interface dos dados do Usuário 
interface User {
  email: string;
  permissions: string[];
  roles: string[];
}

// Interface das credenciais de Sign In
interface SignInCredentials {
  email: string;
  password: string;
}

// Interface dos dados do contexto de autenticação
interface AuthContextData {
  user: User | undefined;
  isAuthenticated: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
}

// Interface das propriedades do Provider de autenticação
interface AuthProviderProps {
  children: ReactNode;
}

// Constante que cria nosso contexto de autenticação
const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, 'nextauth.token');
  destroyCookie(undefined, 'nextauth.refreshToken');

  Router.push('/');
}

// Função do Provider de autenticação
export function AuthProvider({ children }: AuthProviderProps) {
  const thirtyDays = 60 * 60 * 24 * 30; // 30 dias

  const [user, setUser] = useState<User>();
  const isAuthenticated = !! user;

  useEffect(() => {
    const {'nextauth.token': token} = parseCookies();

    if (token) {
      api.get('/me').then(response => {
        const { email, permissions, roles } = response.data;
        setUser({ email, permissions, roles });
      }).catch(() => {
        signOut();
      })
    }
  }, [])

  // Variavel que executa a função de Sign In em nossa aplicação
  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const { data } = await api.post("sessions", {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = data;

      // Seta o token no cookie
      // Caso a função esteja sendo executada pelo Browser (como é o caso daqui),
      // o primeiro parametro é definido como undefined
      setCookie(undefined, "nextauth.token", token, {
        maxAge: thirtyDays, // 30 dias
        path: "/",
      })

      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: thirtyDays, // 30 dias
        path: "/",
      })
  
      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Exportando nosso hook para utilizarmos
// os dados em outras paginas da aplicação
export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
