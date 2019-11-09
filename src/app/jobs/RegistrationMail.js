import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { student, price, plan } = data;

    console.log('A fila executou!');

    Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: '[MATRICULA] - Gympoint',
      template: 'registration',
      context: {
        student: student.name,
        preco: price,
        plano: plan.title,
        duracao: plan.duration,
      },
    });
  }
}

export default new RegistrationMail();
