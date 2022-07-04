import type { GetServerSideProps, NextPage } from 'next';
import { FormEvent, useState } from 'react';

import { useAuth } from '../context/AuthContext';

import styles from '../styles/Home.module.css';
import { withSSRGuest } from '../utils/withSSRGuest';

const Home: NextPage = () => {
  // Utilizando o contexto de autenticação em nossa aplicação
  const { signIn } = useAuth();

  // Criando estados para armazenar o email e password do usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função de submit em nossa aplicação
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <form onSubmit={onSubmit} className={styles.container}>
      <input
        type="email"
        name="email"
        id="email"
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Entrar</button>
    </form>
  )
}

export default Home

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  };
})
