const { Question, User, Answer, Tag, QuestionTag } = require('../models');
const { Op } = require('sequelize');

exports.getAllQuestions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, tag } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    let include = [
      { model: User, as: 'author', attributes: ['id', 'username', 'reputation'] },
      { model: Answer, as: 'answers', attributes: ['id'] },
      { model: Tag, as: 'tags', attributes: ['id', 'name'] }
    ];

    if (tag) {
      include[2] = {
        model: Tag,
        as: 'tags',
        where: { name: tag },
        attributes: ['id', 'name']
      };
    }

    const questions = await Question.findAndCountAll({
      where: whereClause,
      include,
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

exports.getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const question = await Question.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'reputation'] },
        {
          model: Answer,
          as: 'answers',
          include: [{ model: User, as: 'author', attributes: ['id', 'username', 'reputation'] }]
        },
        { model: Tag, as: 'tags', attributes: ['id', 'name'] }
      ]
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.increment('viewCount');

    res.json(question);
  } catch (error) {
    next(error);
  }
};

exports.createQuestion = async (req, res, next) => {
  try {
    const { title, description, tags } = req.body;
    const userId = req.user.id;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const question = await Question.create({
      userId,
      title,
      description
    });

    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagObjects = await Promise.all(
        tags.map(tagName =>
          Tag.findOrCreate({ where: { name: tagName.toLowerCase() } })
        )
      );
      await question.setTags(tagObjects.map(([tag]) => tag));
    }

    const fullQuestion = await Question.findByPk(question.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'reputation'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json(fullQuestion);
  } catch (error) {
    next(error);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;
    const userId = req.user.id;

    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await question.update({ title, description });

    if (tags && Array.isArray(tags)) {
      const tagObjects = await Promise.all(
        tags.map(tagName =>
          Tag.findOrCreate({ where: { name: tagName.toLowerCase() } })
        )
      );
      await question.setTags(tagObjects.map(([tag]) => tag));
    }

    const updatedQuestion = await Question.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'reputation'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'] }
      ]
    });

    res.json(updatedQuestion);
  } catch (error) {
    next(error);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await question.destroy();

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    next(error);
  }
};
