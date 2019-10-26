import Student from '../models/Student';

class StudentController {
  async store(req, res) {
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
}

export default new StudentController();
