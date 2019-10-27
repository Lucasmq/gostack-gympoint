import Registration from '../models/Registrations';

class RegistratioController {
  async store(req, res) {
    req.body.start_date = new Date();
    req.body.end_date = new Date();
    const { id, price } = await Registration.create(req.body);

    return res.json({
      id,
      price,
    });
  }
}

export default new RegistratioController();
