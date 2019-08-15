import Joi from 'joi'

// common validations
const id = Joi.number().required()

// schema for user
const userSchemaCreate = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().required().valid('admin', 'staff')
})

const userSchemaUpdate = Joi.object().keys({
  id,
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  role: Joi.string().valid('admin', 'staff')
})

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

// schema for task
const taskSchema = Joi.object().keys({
  user_id: Joi.number().required(),
  description: Joi.string().required(),
  closed: Joi.boolean().required()
})

const idSchema = Joi.object().keys({
  _id: id
})

export default {
  'post/login': loginSchema,
  'get/user/:id': idSchema,
  'delete/user/:id': idSchema,
  'post/user': userSchemaCreate,
  'put/user': userSchemaUpdate,
  'get/task:id': idSchema,
  'delete/task/:id': idSchema,
  'post/task': taskSchema,
  'put/task': taskSchema
}
