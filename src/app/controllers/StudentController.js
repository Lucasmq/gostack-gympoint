import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .positive()
        .required(),
      height: Yup.number()
        .integer()
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
    });

    // valida se os dados do formulario estão corretos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Estudent already exists.' });
    }

    const { id, name, email, age, height, weight } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      height,
      weight,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .positive(),
      height: Yup.number()
        .integer()
        .positive(),
      weight: Yup.number().positive(),
    });

    // valida se os dados do formulario estão corretos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findOne({
      where: { email: req.body.email },
    });

    if (!student) {
      return res.status(400).json({ error: 'Estudent does not exists.' });
    }

    const { id, name, email } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new StudentController();
