import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import StudentController from './app/controllers/StudentController';
import RegistrationController from './app/controllers/RegistrationController';

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

// Planos
routes.post('/plans', PlanController.store);

// Cadastro de alunos nos planos
routes.post('/registration', RegistrationController.store);

export default routes;
