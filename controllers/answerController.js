const { Answer, User, Question } = require('../models');

exports.createAnswer = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = await Answer.create({
      questionId,
      userId,
      content
    });

    const fullAnswer = await Answer.findByPk(answer.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'reputation'] }]
    });

    res.status(201).json(fullAnswer);
  } catch (error) {
    next(error);
  }
};

exports.updateAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const answer = await Answer.findByPk(id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (answer.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await answer.update({ content });

    const updatedAnswer = await Answer.findByPk(id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'reputation'] }]
    });

    res.json(updatedAnswer);
  } catch (error) {
    next(error);
  }
};

exports.deleteAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const answer = await Answer.findByPk(id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (answer.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await answer.destroy();

    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.markBestAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const answer = await Answer.findByPk(id, {
      include: [{ model: Question, as: 'question' }]
    });

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (answer.question.userId !== userId) {
      return res.status(403).json({ message: 'Only question author can mark best answer' });
    }

    // Unmark previous best answer
    await Answer.update(
      { isMarkedBest: false },
      { where: { questionId: answer.questionId, isMarkedBest: true } }
    );

    // Mark this as best
    await answer.update({ isMarkedBest: true });

    // Increase reputation of answer author
    const answerAuthor = await User.findByPk(answer.userId);
    if (answerAuthor) {
      await answerAuthor.increment('reputation', { by: 15 });
    }

    const updatedAnswer = await Answer.findByPk(id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'reputation'] }]
    });

    res.json(updatedAnswer);
  } catch (error) {
    next(error);
  }
};
