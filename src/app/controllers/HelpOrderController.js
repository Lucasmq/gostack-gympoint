import * as Yup from 'yup';
import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';
import HelpOrder from '../models/HelpOrders';
import Student from '../models/Student';
import User from '../models/User';

class HelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    // valida se os dados do formulario estão corretos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'This student does not exists' });
    }

    const { id, question } = await HelpOrder.create({
      student_id: req.params.id,
      question: req.body.question,
    });
    return res.json({
      id,
      question,
    });
  }

  async index(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'This student does not exists' });
    }

    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id: req.params.id,
      },
    });

    return res.json(helpOrders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    // valida se os dados do formulario estão corretos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const helpOrder = await HelpOrder.findOne({
      id: req.params.id,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    const { student } = helpOrder;

    const user = await User.findByPk(req.userId);

    if (!helpOrder) {
      req.status(400).json({ error: 'Thies help order does not exists' });
    }

    const { id, question, answer } = await helpOrder.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    await Queue.add(AnswerMail.key, {
      question,
      answer,
      student,
      user,
    });

    return res.json({
      id,
      question,
      answer,
    });
  }
}

export default new HelpOrderController();
