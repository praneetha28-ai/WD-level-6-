"use strict";
const { Model,Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addTodo({ title, dueDate }) {
      console.log(title);
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }
    static getTodosList() {
      return this.findAll({ order: [["id", "ASC"]] });
    }
    markAsCompleted() {
      return this.update({ completed: true });
    }
    delete() {
      return this.destroy();
    }
    static getTodos() {
      return this.findAll();
    }
    static overdue() {
      return this.findAll({
        where: {
          completed: false,
          dueDate: {
            [Op.lt]: new Date(),
          },
        },
      });
    }
    static dueToday() {
      return this.findAll({
        where: {
          
          completed: false,
          dueDate: {
            [Op.eq]: new Date(),
          },
        },
      });
    }

    static dueLater() {
      return this.findAll({
        where: {
          
          completed: false,
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
      });
    }
    static async remove(id){
      return this.destroy({
        where:{
          id,
        }
      });
    }
    static completed() {
      return this.findAll({
        where: {
          
          completed: true,
        },
      });
    }
    setCompletionStatus(completed) {
        return this.update({
          completed,
        });
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
