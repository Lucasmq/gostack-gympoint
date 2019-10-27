import Plan from '../models/Plans';

class PlanController {
  async store(req, res) {
    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }
}

export default new PlanController();
