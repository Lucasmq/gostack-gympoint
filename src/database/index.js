import Sequelize from 'sequelize';

import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plans';
import Registration from '../app/models/Registrations';
import Checkin from '../app/models/Checkins';
import HelpOrder from '../app/models/HelpOrders';

import databaseConfig from '../config/database';

const models = [User, Student, Plan, Registration, Checkin, HelpOrder];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    // inicia a conexão de cada model com o banco de dados
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
