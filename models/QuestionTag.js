const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const QuestionTag = sequelize.define('QuestionTag', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  questionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Questions',
      key: 'id'
    }
  },
  tagId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Tags',
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['questionId', 'tagId']
    }
  ]
});

module.exports = QuestionTag;
