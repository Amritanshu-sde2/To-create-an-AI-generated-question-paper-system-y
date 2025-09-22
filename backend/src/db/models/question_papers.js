const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const question_papers = sequelize.define(
    'question_papers',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

title: {
        type: DataTypes.TEXT,

      },

status: {
        type: DataTypes.ENUM,

        values: [

"Pending",

"Approved",

"Rejected"

        ],

      },

submission_date: {
        type: DataTypes.DATE,

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  question_papers.associate = (db) => {

    db.question_papers.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.question_papers.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return question_papers;
};

