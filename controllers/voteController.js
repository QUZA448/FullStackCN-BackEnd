const { Vote, Question, Answer, User } = require('../models');

exports.vote = async (req, res, next) => {
  try {
    const { targetId, targetType, voteType } = req.body;
    const userId = req.user.id;

    if (!targetId || !targetType || !voteType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['question', 'answer'].includes(targetType)) {
      return res.status(400).json({ message: 'Invalid targetType' });
    }

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid voteType' });
    }

    // Get the target
    const Model = targetType === 'question' ? Question : Answer;
    const target = await Model.findByPk(targetId);

    if (!target) {
      return res.status(404).json({ message: `${targetType} not found` });
    }

    // Check if user is voting on their own content
    if (target.userId === userId) {
      return res.status(403).json({ message: 'Cannot vote on your own content' });
    }

    // Check existing vote
    const existingVote = await Vote.findOne({
      where: { userId, targetId, targetType }
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote if voting same way again
        await existingVote.destroy();
        await updateVoteCount(targetType, targetId, voteType, -1);

        return res.json({ message: 'Vote removed' });
      } else {
        // Change vote
        const oldVoteType = existingVote.voteType;
        await existingVote.update({ voteType });
        await updateVoteCount(targetType, targetId, oldVoteType, -1);
        await updateVoteCount(targetType, targetId, voteType, 1);

        return res.json({ message: 'Vote changed' });
      }
    }

    // Create new vote
    await Vote.create({ userId, targetId, targetType, voteType });
    await updateVoteCount(targetType, targetId, voteType, 1);

    // Update reputation
    const targetAuthor = await User.findByPk(target.userId);
    if (targetAuthor) {
      const repChange = voteType === 'upvote' ? 5 : -2;
      await targetAuthor.increment('reputation', { by: repChange });
    }

    res.status(201).json({ message: `${voteType} successful` });
  } catch (error) {
    next(error);
  }
};

const updateVoteCount = async (targetType, targetId, voteType, increment) => {
  const Model = targetType === 'question' ? Question : Answer;
  const field = voteType === 'upvote' ? 'upvotes' : 'downvotes';

  await Model.update(
    { [field]: Model.sequelize.where(Model.sequelize.col(field), 'IS NOT', null) },
    { where: { id: targetId }, raw: true }
  );

  const target = await Model.findByPk(targetId);
  await target.increment(field, { by: increment });
};

exports.getVote = async (req, res, next) => {
  try {
    const { targetId, targetType } = req.query;
    const userId = req.user.id;

    if (!targetId || !targetType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const vote = await Vote.findOne({
      where: { userId, targetId, targetType }
    });

    res.json(vote || null);
  } catch (error) {
    next(error);
  }
};
