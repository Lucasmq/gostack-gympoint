import * as Yup from 'yup';
import Plan from '../models/Plans';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'price'],
    });

    if (!plans) {
      return res.status(400).json({ error: 'Has no one plans created yet.' });
    }

    return res.json({
      plans,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(401).json({ error: 'Plan not found!' });
    }

    // atualiza o plano encontrado no BD
    const { id, title, duration, price, canceled_at } = await plan.update(
      req.body
    );

    return res.json({
      id,
      title,
      duration,
      price,
      canceled_at,
    });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(401).json({ error: 'Plan not found!' });
    }

    if (plan.canceledAt) {
      return res.status(400).json({ error: 'Plan already canceled' });
    }

    plan.canceledAt = new Date();

    await plan.save();

    return res.json(plan);
  }
}

export default new PlanController();
