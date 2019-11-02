import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.FLOAT,
        canceledAt: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Plan;
