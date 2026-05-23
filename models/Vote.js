const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Vote = sequelize.define('Vote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  targetId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  targetType: {
    type: DataTypes.ENUM('question', 'answer'),
    allowNull: false
  },
  voteType: {
    type: DataTypes.ENUM('upvote', 'downvote'),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'targetId', 'targetType']
    }
  ]
});

module.exports = Vote;
