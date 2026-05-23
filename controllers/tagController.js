const { Tag, Question } = require('../models');

exports.getAllTags = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const tags = await Tag.findAndCountAll({
      include: [{ model: Question, as: 'questions', attributes: ['id'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json(
      tags.rows.map(tag => ({
        id: tag.id,
        name: tag.name,
        description: tag.description,
        count: tag.questions.length
      }))
    );
  } catch (error) {
    next(error);
  }
};

exports.getTagByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const tag = await Tag.findOne({ where: { name } });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    const questions = await Question.findAndCountAll({
      include: [
        {
          model: Tag,
          as: 'tags',
          where: { id: tag.id }
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      tag: {
        id: tag.id,
        name: tag.name,
        description: tag.description
      },
      questions: questions.rows,
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

exports.createTag = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Tag name is required' });
    }

    const tag = await Tag.create({
      name: name.toLowerCase(),
      description
    });

    res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
};

exports.updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    await tag.update({ description });

    res.json(tag);
  } catch (error) {
    next(error);
  }
};
