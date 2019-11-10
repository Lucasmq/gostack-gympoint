import HelpOrder from '../models/HelpOrders';

class UnansweredHelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer: null,
      },
    });

    return res.json(helpOrders);
  }
}

export default new UnansweredHelpOrderController();
