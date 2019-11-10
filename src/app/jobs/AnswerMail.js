import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { student, user, question, answer } = data;

    console.log('A fila executou!');

    Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: '[RESPOSTA] - Gympoint',
      template: 'answer',
      context: {
        student: student.name,
        question,
        answer,
        user: user.name,
      },
    });
  }
}

export default new RegistrationMail();
