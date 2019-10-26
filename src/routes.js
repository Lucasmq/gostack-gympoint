import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// Não permite o cadastro/atualização sem estar autenticado
routes.use(authMiddleware);

routes.put('/users/update', UserController.update);

// Cadastro de alunos
routes.post('/students', StudentController.store);
routes.put('/student/update', StudentController.update);

export default routes;
