import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthObject } from '../src/auth/dto/auth.dto';
import { LoginAuthDto } from 'src/auth/dto';

describe('app e2e test', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({}));
        await app.init();
        await app.listen(8080);

        prisma = app.get(PrismaService);
        await prisma.cleanDB();
        pactum.request.setBaseUrl('http://localhost:8080');
    });

    afterAll(() => {
        app.close();
    });
    describe('Auth', () => {
        describe('Sign Up', () => {
            const data: AuthObject = {
                firstName: 'Mihir',
                lastName: 'Waykole',
                email: 'waykole.mihir1703@gmail.com',
                password: 'Mihir1703#',
            };
            it('sign up a user', () => {
                return pactum.spec().post('/auth/signup').withBody(data).expectStatus(200);
            });
            it('email already exists', () => {
                return pactum.spec().post('/auth/signup').withBody(data).expectStatus(403);
            });
            it('email is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({
                        password: data.password,
                        email: '',
                    })
                    .expectStatus(400);
            });
            it('password is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({
                        password: '',
                        email: data.email,
                    })
                    .expectStatus(400);
            });
            it('email is invalid', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({
                        password: data.password,
                        email: 'mihir',
                    })
                    .expectStatus(400);
            });
            it('password is too weak', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({
                        ...data,
                        password: 'cool',
                    })
                    .expectStatus(403);
            });
        });
        describe('Sign In', () => {
            const data: LoginAuthDto = {
                email: 'waykole.mihir1703@gmail.com',
                password: 'Mihir1703#',
            };
            it('sign in a user', () => {
                return pactum.spec().post('/auth/login').withBody(data).expectStatus(200).stores('user', 'token');
            });
            it('email is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({
                        password: data.password,
                        email: '',
                    })
                    .expectStatus(400);
            });
            it('password is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({
                        password: '',
                        email: data.email,
                    })
                    .expectStatus(400);
            });
            it('email not found', () => {
                return pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({
                        password: data.password,
                        email: 'mihir@gmail.com',
                    })
                    .expectStatus(403);
            });
            it('password is incorrect', () => {
                return pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({ ...data, password: 'cool' })
                    .expectStatus(403);
            });
        });
    });
    describe('User', () => {
        describe('Get User', () => {
            it('get user', () => {
                return pactum.spec().get('/user').withHeaders('Authorization', `Bearer $S{user}`).expectStatus(200);
            });
        });
        describe('Update User', () => {
            it('edit user', () => {
                return pactum
                    .spec()
                    .patch('/user/edit')
                    .withHeaders('Authorization', `Bearer $S{user}`)
                    .withBody({
                        firstName: 'Mihir',
                        lastName: 'Bhai',
                        email: 'waykole.mihir1703@gmail.com',
                    })
                    .expectStatus(200);
            });
            it('edit user with invalid email', () => {
                return pactum
                    .spec()
                    .patch('/user/edit')
                    .withHeaders('Authorization', `Bearer $S{user}`)
                    .withBody({
                        firstName: 'Mihir',
                        lastName: 'Bhai',
                        email: 'mihir',
                    })
                    .expectStatus(400);
            });
            it('edit user with empty email', () => {
                return pactum
                    .spec()
                    .patch('/user/edit')
                    .withHeaders('Authorization', `Bearer $S{user}`)
                    .withBody({
                        firstName: 'Mihir',
                        lastName: 'Bhai',
                        email: '',
                    })
                    .expectStatus(400);
            });
            it('edit user with empty first or last name', () => {
                return pactum
                    .spec()
                    .patch('/user/edit')
                    .withHeaders('Authorization', `Bearer $S{user}`)
                    .withBody({
                        firstName: 'Mihir',
                        lastName: '',
                    })
                    .expectStatus(400);
            });
        });
    });
});
