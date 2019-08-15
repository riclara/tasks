import express from 'express'
import Validator from './validator'
import { user, task, salt } from './models'
import { generateToken, validateToken } from './jwt'
import bcrypt from 'bcryptjs'

const validateRequest = Validator(true)
const router = express.Router()

function validateRol (request, response, next) {
  if (!request.isAdmin) {
    response.status(403).json({status: 403, error: 'access deny'})
  } else {
    next()
  }
}

// for test purpose
router.get('/', validateRequest, (request, response) => {
  response.status(200).end()
})

router.post('/login', validateRequest, (request, response) => {
  user.findOne({ where: {email: request.body.email} })
    .then(user => {
      if (user && bcrypt.compareSync(request.body.password, user.password)) {
        generateToken(user, response)
      } else {
        response.status(403).json({error: 'user or password invalid'})
      }
    })
    .catch(reason => response.status(500).json({error: reason.message}))
})

router.get('/user/:id', [validateRequest, validateToken, validateRol], (request, response) => {
  user.findByPk(request.params.id).then(user => {
    let payload = user.get({
      plain: true
    })
    delete payload.password
    response.json(payload)
  }).catch(reason => response.status(500).json({error: reason.message}))
})

router.post('/user', [validateRequest, validateToken, validateRol], (request, response) => {
  request.body.password = bcrypt.hashSync(request.body.password, salt)
  user.create(request.body)
    .then(user => {
      let payload = user.get({
        plain: true
      })
      delete payload.password
      response.json(payload)
    })
    .catch(reason => response.status(500).json({error: reason.message}))
})

router.put('/user/:id', [validateRequest, validateToken, validateRol], (request, response) => {
  if (request.body.password) {
    request.body.password = bcrypt.hashSync(request.body.password, salt)
  }
  user.findByPk(request.params.id)
    .then(user => user.update(request.body))
    .then(user => {
      let payload = user.get({
        plain: true
      })
      delete payload.password
      response.json(payload)
    })
    .catch(reason => response.status(500).json({error: reason.message}))
})

router.delete('/user/:id', [validateRequest, validateToken, validateRol], (request, response) => {
  user.findByPk(request.params.id)
    .then(user => user.destroy())
    .then(res => response.json(res))
    .catch(reason => response.status(500).json({error: reason.message}))
})

router.get('/task/:id', [validateRequest, validateToken], (request, response) => {
  const qry = {id: request.params.id}
  if (!request.isAdmin) {
    qry['user_id'] = request.user.id
  }
  task.findOne({where: qry}).then(task => {
    response.json(task)
  }).catch(reason => response.status(500).json({error: reason.message}))
})

router.post('/task', [validateRequest, validateToken, validateRol], (request, response) => {
  task.create(request.body)
    .then(task => response.json(task))
    .catch(reason => response.status(500).json({error: reason.message}))
})

router.put('/task/:id', [validateRequest, validateToken], (request, response) => {
  const qry = {id: request.params.id}
  if (!request.isAdmin) {
    qry['user_id'] = request.user.id
    request.body.user_id = request.user.id
  }

  task.findOne({where: qry})
    .then(task => {
      if (!task) throw new Error('task not available')
      return task.update(request.body)
    })
    .then(task => response.json(task))
    .catch(reason => {
      if (reason.message === 'task not available') return response.status(403).json({error: reason.message})
      response.status(500).json({error: reason.message})
    })
})

router.delete('/task/:id', [validateRequest, validateToken, validateRol], (request, response) => {
  task.findByPk(request.params.id)
    .then(task => task.destroy())
    .then(res => response.json(res))
    .catch(reason => response.status(500).json({error: reason.message}))
})

export default router
