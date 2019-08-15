import Sequelize from 'sequelize'
import bcrypt from 'bcryptjs'

const sequelize = new Sequelize(`sqlite:${process.env.NODE_ENV}.db`)
const _salt = bcrypt.genSaltSync(10)

class User extends Sequelize.Model {}
class Task extends Sequelize.Model {}

User.init({
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.ENUM('admin', 'staff'),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'user'
  // options
})

Task.init({
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      // This is a reference to another model
      model: User,

      // This is the column name of the referenced model
      key: 'id',

      // This declares when to check the foreign key constraint. PostgreSQL only.
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  closed: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'task'
  // options
})

export const sync = () => {
  return sequelize.sync({ force: process.env.NODE_ENV === 'test' }).then(() => {
    return User.findOrCreate({
      where: {email: 'test@email.com'},
      defaults: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@email.com',
        password: bcrypt.hashSync('test123', _salt),
        role: 'admin'
      }
    })
  })
}

export const user = User
export const task = Task
export const salt = _salt
