import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import {Alert, Container} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {Pagination} from '../components/Pagination';
import { useState, useEffect } from "react";

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  users: TUserItem[]
  totalPages: number
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const res = await fetch("http://localhost:3000/users", {method: 'GET'})
    if (!res.ok) {
      return {props: {statusCode: res.status, users: [], totalPages: 0}}
    }
    const {users, totalPages} = await res.json()
    return {
      props: {statusCode: 200, users, totalPages}
    }
  } catch (e) {
    return {props: {statusCode: 500, users: [], totalPages: 0}}
  }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home(props: TGetServerSideProps) {
  const [statusCode, setStatusCode] = useState(props.statusCode);
  const [users, setUsers] = useState(props.users);
  const [totalPages, setTotalPages] = useState(props.totalPages);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(Array.from({ length: 10 }, (_, i) => i + 1));
  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }
  useEffect(() => {
    getUsers(currentPage);
  }, [currentPage]);

  async function getUsers(page: number) {
    try {
      const res = await fetch("http://localhost:3000/users?" + new URLSearchParams({numPage: page.toString()}), {method: 'GET'})
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const {users, totalPages} = await res.json();
      setUsers(users);
      setTotalPages(totalPages);
      setStatusCode(res.status);
    } catch (e) {
       setStatusCode(500)
    }
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    onPagesArrChange(page);
  }

  const onPagesArrChange = (page: number) => {
    const maxPermit = pages.at(-3) ? pages.at(-3) : 1;
    const minPermit = pages[3] ? pages[3] : 1;
    if(page >= maxPermit) {
      const shift = pages.at(-1) ? 4 - (pages.at(-1) - page) : 5;
      const startPage = (pages[0] + shift) < (totalPages - 9) ? (pages[0] + shift) : (totalPages - 9);
      const newPagesArr = Array.from({ length: 10 }, (_, i) => startPage + i);
      setPages(newPagesArr);
    }
    else if(page <= minPermit) {
      const shift = pages[0] ? 4 - (page - pages[0]) : 5;
      const startPage = (pages[0] - shift) > 1 ? (pages[0] - shift) : 1;
      const newPagesArr = Array.from({ length: 10 }, (_, i) => startPage + i);
      setPages(newPagesArr);
    }
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            pages={pages}
            onPageChange={onPageChange}
          />

        </Container>
      </main>
    </>
  );
}
