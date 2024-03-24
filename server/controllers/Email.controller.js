const sendEmailService = require("../service/Email.service");

const emailController = {

  sendEmail: async (req, res, next) => {
    try {
      const { email, message, yourname } = req.body;
      if (!email) {
        return next(errorHandler(400, 'Email not found!'));
      }
      const response = await sendEmailService(email, message, yourname);
      res.status(200).json(response);
    }
    catch (err) {
      next(err);
    }
  }

}

module.exports = emailController;
