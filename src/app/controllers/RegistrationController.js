import * as Yup from 'yup';
import { parseISO, addMonths } from 'date-fns';
import Sequelize from 'sequelize';
import Registration from '../models/Registrations';
import Plan from '../models/Plans';

import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';
import Student from '../models/Student';

class RegistratioController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plan = await Plan.findOne({
      where: {
        id: req.body.plan_id,
        canceled_at: null,
      },
    });

    if (!plan) {
      return res.status(400).json({ error: 'This plan doest exists' });
    }

    // Permite ao responsável controlar o preço caso queira da desconto
    if (!req.body.price) {
      req.body.price = plan.price * plan.duration;
    }

    const monthsDuration = plan.duration;

    // req.body.start_date = new Date();
    req.body.end_date = addMonths(
      new Date(parseISO(req.body.start_date)),
      monthsDuration
    );
    const { id, price } = await Registration.create(req.body);

    const student = await Student.findByPk(req.body.student_id);

    await Queue.add(RegistrationMail.key, {
      student,
      plan,
      price,
    });

    return res.json({
      id,
      price,
      plan,
    });
  }

  async index(req, res) {
    const { Op } = Sequelize;
    const { page = 1 } = req.query.page > 0 ? req.query : 1;
    /*
     * Lista as matriculas ainda vingentes pela data de termino
     */
    const registrations = await Registration.findAll({
      where: {
        end_date: {
          [Op.gte]: new Date(),
        },
      },
      order: ['start_date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: [
        'id',
        'price',
        'start_date',
        'end_date',
        'student_id',
        'plan_id',
      ],
    });

    return res.json({
      registrations,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const registration = await Registration.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!registration) {
      return res.status(401).json({ error: 'Registration not found!' });
    }

    const { id, student_id, plan_id, price } = await registration.update(
      req.body
    );

    return res.json({
      id,
      student_id,
      plan_id,
      price,
    });
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(401).json({ error: 'Registration not found!' });
    }

    if (registration.canceledAt) {
      return res.status(400).json({ error: 'Registration already canceled' });
    }

    registration.canceledAt = new Date();

    await registration.save();

    return res.json(registration);
  }
}

export default new RegistratioController();
