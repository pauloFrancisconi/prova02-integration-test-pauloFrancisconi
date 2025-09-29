import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Json Placeholder (ReqRes API)', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://reqres.in/api';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('LOGIN', () => {
    it('deve logar com sucesso usando headers e payload válidos', async () => {
      const token = await p
        .spec()
        .post(`${baseUrl}/login`)
        .withHeaders({
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1'
        })
        .withJson({
          email: 'eve.holt@reqres.in',
          password: 'cityslicka'
        })
        .expectStatus(StatusCodes.OK)
        .returns('token');

      expect(typeof token).toBe('string');
    });

    it('deve falhar ao logar quando o email estiver ausente', async () => {
      await p
        .spec()
        .post(`${baseUrl}/login`)
        .withHeaders({
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1'
        })
        .withJson({
          password: 'cityslicka'
        })
        .expectStatus(StatusCodes.BAD_REQUEST)
        .expectBodyContains('Missing email or username');
    });

    it('deve falhar ao logar quando a senha estiver ausente', async () => {
      await p
        .spec()
        .post(`${baseUrl}/login`)
        .withHeaders({
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1'
        })
        .withJson({
          email: 'eve.holt@reqres.in'
        })
        .expectStatus(StatusCodes.BAD_REQUEST)
        .expectBodyContains('Missing password');
    });
    it('deve falhar ao logar quando o corpo da requisição estiver vazio', async () => {
      await p
        .spec()
        .post(`${baseUrl}/login`)
        .withHeaders({
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1'
        })
        .withJson({}) 
        .expectStatus(StatusCodes.BAD_REQUEST)
        .expectJson({
          error: 'Missing email or username'
        });
    });


  });

  

  describe('DELETE /users/{id}', () => {
    it('deve deletar usuário existente e retornar 204 No Content', async () => {
      await p
        .spec()
        .delete(`${baseUrl}/users/2`)
        .withHeaders({
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1'
        })
        .expectStatus(StatusCodes.NO_CONTENT);
    });


  });

  describe('GET /users', () => {
    it('deve retornar lista de usuários na página 1', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users`)
        .withHeaders({
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1'
        })
        .withQueryParams('page', '1')
        .expectStatus(StatusCodes.OK);
    });

    it('deve retornar lista de usuários na página 2', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users`)
        .withHeaders({
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1'
        })
        .withQueryParams('page', '2')
        .expectStatus(StatusCodes.OK);
    });

    it('deve retornar lista de usuários com 6 itens por página', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users`)
        .withHeaders({
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1'
        })
        .withQueryParams('per_page', '6')
        .expectStatus(StatusCodes.OK);
    });
  });

  describe('GET /users/{id}', () => {
    it('deve retornar usuário com ID 2', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users/2`)
        .withHeaders({
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1'
        })
        .expectStatus(StatusCodes.OK);
    });

    it('deve retornar 404 para usuário com ID inexistente', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users/oi`)
        .withHeaders({
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1'
        })
        .expectStatus(StatusCodes.NOT_FOUND);
    });
  });
});
