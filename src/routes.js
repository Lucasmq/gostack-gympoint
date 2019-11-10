import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import StudentController from './app/controllers/StudentController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import UnansweredHelpOrderController from './app/controllers/UnansweredHelpOrderController';

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
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

// Cadastro de alunos nos planos
routes.post('/registrations', RegistrationController.store);
routes.get('/registrations', RegistrationController.index);
routes.put('/registrations/update', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.delete);

// Checkin
routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);

// HelpOrderController
routes.post('/students/:id/help-orders', HelpOrderController.store);
routes.get('/students/:id/help-orders', HelpOrderController.index);
routes.put('/help-orders/:id/answer', HelpOrderController.update);

// UnansweredController
routes.get(
  '/students/help-orders-unanswered',
  UnansweredHelpOrderController.index
);

export default routes;
