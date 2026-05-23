const User = require('./User');
const Question = require('./Question');
const Answer = require('./Answer');
const Vote = require('./Vote');
const Tag = require('./Tag');
const QuestionTag = require('./QuestionTag');

// Define associations
User.hasMany(Question, { foreignKey: 'userId', as: 'questions' });
Question.belongsTo(User, { foreignKey: 'userId', as: 'author' });

User.hasMany(Answer, { foreignKey: 'userId', as: 'answers' });
Answer.belongsTo(User, { foreignKey: 'userId', as: 'author' });

Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

Question.belongsToMany(Tag, { through: QuestionTag, as: 'tags' });
Tag.belongsToMany(Question, { through: QuestionTag, as: 'questions' });

module.exports = {
  User,
  Question,
  Answer,
  Vote,
  Tag,
  QuestionTag
};
