import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

process.env.JWT_SECRET ??= 'test-secret-de-al-menos-treinta-y-dos-caracteres';

describe('API escuela (e2e)', () => {
  let app: INestApplication<App>;
  let adminToken: string;
  let consultaToken: string;

  const login = async (email: string, password: string) =>
    request(app.getHttpServer()).post('/auth/login').send({ email, password });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    adminToken = (await login('admin@prueba.test', 'Admin123*')).body
      .accessToken;
    consultaToken = (await login('consulta@prueba.test', 'Consulta123*')).body
      .accessToken;
  });

  afterAll(() => app.close());

  describe('auth', () => {
    it('login válido devuelve token y usuario sin passwordHash', async () => {
      const res = await login('admin@prueba.test', 'Admin123*');
      expect(res.status).toBe(200);
      expect(res.body.accessToken).toEqual(expect.any(String));
      expect(res.body.user).toEqual({
        id: 1,
        nombre: expect.any(String),
        email: 'admin@prueba.test',
        rol: 'ADMIN',
      });
      expect(JSON.stringify(res.body)).not.toContain('passwordHash');
    });

    it('credenciales inválidas → 401 con mensaje genérico', async () => {
      const res = await login('consulta@prueba.test', 'mala');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Credenciales incorrectas');
      expect(res.body.stack).toBeUndefined();
    });

    it('/auth/me sin token → 401', () =>
      request(app.getHttpServer()).get('/auth/me').expect(401));

    it('/auth/me devuelve el perfil de cada usuario (no se cachea entre usuarios)', async () => {
      const server = app.getHttpServer();
      const admin = await request(server)
        .get('/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);
      const consulta = await request(server)
        .get('/auth/me')
        .set('Authorization', `Bearer ${consultaToken}`);
      expect(admin.body.rol).toBe('ADMIN');
      expect(consulta.body.rol).toBe('CONSULTA');
    });
  });

  describe('schools', () => {
    it('sin token → 401', () =>
      request(app.getHttpServer()).get('/schools').expect(401));

    it('lista paginada sin datos sensibles', async () => {
      const res = await request(app.getHttpServer())
        .get('/schools?limit=5')
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(200);
      expect(res.body.data).toHaveLength(5);
      expect(res.body.meta.total).toBe(20);
      expect(Object.keys(res.body.data[0]).sort()).toEqual([
        'codigo',
        'departamento',
        'id',
        'matricula',
        'municipio',
        'nombre',
      ]);
    });

    it('filtra por departamento', async () => {
      const res = await request(app.getHttpServer())
        .get('/schools?departamento=La%20Paz')
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(200);
      expect(
        res.body.data.every(
          (s: { departamento: string }) => s.departamento === 'La Paz',
        ),
      ).toBe(true);
    });

    it('CONSULTA no puede actualizar matrícula → 403', () =>
      request(app.getHttpServer())
        .patch('/schools/1')
        .set('Authorization', `Bearer ${consultaToken}`)
        .send({ matricula: 10 })
        .expect(403));

    it('matrícula inválida → 400', () =>
      request(app.getHttpServer())
        .patch('/schools/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ matricula: -5 })
        .expect(400));

    it('ADMIN actualiza y el listado cacheado refleja el cambio', async () => {
      const server = app.getHttpServer();
      const auth = { Authorization: `Bearer ${adminToken}` };
      await request(server).get('/schools/1').set(auth).expect(200); // llena la caché

      await request(server)
        .patch('/schools/1')
        .set(auth)
        .send({ matricula: 999 })
        .expect(200);

      const res = await request(server).get('/schools/1').set(auth).expect(200);
      expect(res.body.matricula).toBe(999);
    });

    it('id inexistente → 404', () =>
      request(app.getHttpServer())
        .patch('/schools/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ matricula: 1 })
        .expect(404));
  });
});
