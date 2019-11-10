import { subDays } from 'date-fns';
import Sequelize from 'sequelize';
import Student from '../models/Student';
import Checkin from '../models/Checkins';

class CheckinController {
  async store(req, res) {
    const { Op } = Sequelize;
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'This student does not exists' });
    }

    // condição em que seja no max 5 checkin por semana
    const numberCheckins = await Checkin.count({
      where: {
        student_id: req.params.id,
        created_at: {
          [Op.gt]: subDays(new Date(), 7),
        },
      },
    });

    if (numberCheckins >= 5) {
      return res.status(401).json({
        error:
          'This student exceds the max number of checkin on the last 7 days',
      });
    }

    Checkin.create({ student_id: req.params.id });

    return res.status(201).json({ checkin: 'ok' });
  }

  async index(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'This student does not exists' });
    }

    const checkins = await Checkin.findAll({
      where: {
        student_id: req.params.id,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json({ checkins });
  }
}

export default new CheckinController();
