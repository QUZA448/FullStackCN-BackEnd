const { User, Question, Answer } = require('../models');

exports.getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const questionCount = await Question.count({ where: { userId: id } });
    const answerCount = await Answer.count({ where: { userId: id } });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      reputation: user.reputation,
      bio: user.bio,
      avatar: user.avatar,
      questionCount,
      answerCount,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserQuestions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const questions = await Question.findAndCountAll({
      where: { userId: id },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'reputation'] },
        { model: Answer, as: 'answers', attributes: ['id'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: questions.rows,
      pagination: {
        total: questions.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(questions.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserAnswers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const answers = await Answer.findAndCountAll({
      where: { userId: id },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'reputation'] },
        {
          model: Question,
          as: 'question',
          attributes: ['id', 'title']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: answers.rows,
      pagination: {
        total: answers.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(answers.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bio, avatar } = req.body;
    const currentUserId = req.user.id;

    if (id !== currentUserId) {
      return res.status(403).json({ message: 'Can only update your own profile' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ bio, avatar });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      reputation: user.reputation,
      bio: user.bio,
      avatar: user.avatar
    });
  } catch (error) {
    next(error);
  }
};

exports.getTopUsers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['reputation', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
};
