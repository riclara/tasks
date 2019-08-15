process.env.NODE_ENV = 'test'

import app from '../server/app'
import request from 'supertest'
let admintToken = ''
let staffToken = ''

beforeAll(() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 4000);
  })
})

afterAll((done) => {
  app.close()
  setTimeout(() => {
    done()
  }, 3000);
})

test('It should response the GET method', (done) => {
    request(app).get('/').then((response) => {
      expect(response.statusCode).toBe(200);
      done()
    })
})

describe('User tests', () => {
  test('It should response the token', (done) => {
    request(app).post('/login')
    .send({ email: 'test@email.com',
            password: 'test123'})
    .then((response) => {
      expect(response.statusCode).toBe(200)
      expect(response.body.token).not.toBeNull()
      admintToken = 'Bearer ' + response.body.token
      done()
    })
  })

  test('It should create first staff user', (done) => {
    request(app).post('/user')
    .set('Authorization', admintToken)
    .send({
      firstName: "Juan",
      lastName: "Lara",
      email: "juan@gmail.com",
      password: "test123",
      role: "staff"
    })
    .then((response) => {
      expect(response.statusCode).toBe(200)
      expect(response.body.id).not.toBeNull()
      done()
    })
  })

  test('It should create second staff user', (done) => {
    request(app).post('/user')
    .set('Authorization', admintToken)
    .send({
      firstName: "Karen",
      lastName: "Lara",
      email: "karen@gmail.com",
      password: "test123",
      role: "staff"
    })
    .then((response) => {
      expect(response.statusCode).toBe(200)
      expect(response.body.id).not.toBeNull()
      done()
    })
  })

  test('It should avoid to staff users create an user', (done) => {
    request(app).post('/user')
    .set('Authorization', staffToken)
    .send({
      firstName: "test",
      lastName: "test",
      email: "test@gmail.com",
      password: "test123",
      role: "admin"
    })
    .then((response) => {
      expect(response.statusCode).toBe(401)
      done()
    })
  })

  test('It should response the staff token', (done) => {
    request(app).post('/login')
    .send({ email: 'juan@gmail.com',
            password: 'test123'})
    .then((response) => {
      expect(response.statusCode).toBe(200)
      expect(response.body.token).not.toBeNull()
      staffToken = 'Bearer ' + response.body.token
      done()
    })
  })

  test('It should retrieve an user', (done) => {
    request(app).get('/user/1')
      .set('Authorization', admintToken)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.id).not.toBeNull()
        expect(response.body.id).toEqual(1)
        expect(response.body.email).toEqual('test@email.com')
        done()
    })
  })

  test('It should avoid retrieve an user to staff users', (done) => {
    request(app).get('/user/1')
      .set('Authorization', staffToken)
      .then((response) => {
        expect(response.statusCode).toBe(403);
        done()
    })
  })

  test('It should update the staff user', (done) => {
    request(app).put('/user/2')
    .set('Authorization', admintToken)
    .send({
      firstName: "Juan2",
    })
    .then((response) => {
      expect(response.statusCode).toBe(200)
      expect(response.body.id).not.toBeNull()
      expect(response.body.firstName).toEqual('Juan2')
      done()
    })
  })


  test('It should avoid update an user to staff users', (done) => {
    request(app).put('/user/2')
    .set('Authorization', staffToken)
    .send({
      firstName: "Juan2",
    })
    .then((response) => {
      expect(response.statusCode).toBe(403)
      done()
    })
  })

  test('It should delete the second staff user', (done) => {
    request(app).delete('/user/3')
    .set('Authorization', admintToken)
    .then((response) => {
      expect(response.statusCode).toBe(200)
      done()
    })
  })

  test('It should avoid delete users to staff user', (done) => {
    request(app).delete('/user/2')
    .set('Authorization', staffToken)
    .then((response) => {
      expect(response.statusCode).toBe(403)
      done()
    })
  })
})


describe('Task tests', () => {
  test('It should create a task for admin user', (done) => {
    request(app).post('/task')
    .set('Authorization', admintToken)
    .send({
      user_id: 1,
	    description: "Test task description for admin",
	    closed: false
    })
    .then((response) => {
      expect(response.statusCode).toBe(200)
      expect(response.body.id).not.toBeNull()
      expect(response.body.user_id).toEqual(1)
      expect(response.body.description).toEqual('Test task description for admin')
      expect(response.body.closed).toEqual(false)
      done()
    })
  })

  test('It should create a task for staff user', (done) => {
    request(app).post('/task')
    .set('Authorization', admintToken)
    .send({
      user_id: 2,
	    description: "Test task description for staff",
	    closed: false
    })
    .then((response) => {
      expect(response.statusCode).toBe(200)
      expect(response.body.id).not.toBeNull()
      expect(response.body.user_id).toEqual(2)
      expect(response.body.description).toEqual('Test task description for staff')
      expect(response.body.closed).toEqual(false)
      done()
    })
  })

  test('It should update a task for staff admin', (done) => {
    request(app).put('/task/1')
    .set('Authorization', admintToken)
    .send({
	    closed: true
    })
    .then((response) => {
      expect(response.statusCode).toBe(200)
      expect(response.body.id).not.toBeNull()
      expect(response.body.user_id).toEqual(1)
      expect(response.body.description).toEqual('Test task description for admin')
      expect(response.body.closed).toEqual(true)
      done()
    })
  })

  test('It should avoid to staff user edit an admin task', (done) => {
    request(app).put('/task/1')
    .set('Authorization', staffToken)
    .send({
	    closed: false
    })
    .then((response) => {
      expect(response.statusCode).toBe(403)
      done()
    })
  })

  test('It should allow to an staff user update his task', (done) => {
    request(app).put('/task/2')
    .set('Authorization', staffToken)
    .send({
	    closed: true
    })
    .then((response) => {
      expect(response.statusCode).toBe(200)
      expect(response.body.id).not.toBeNull()
      expect(response.body.user_id).toEqual(2)
      expect(response.body.description).toEqual('Test task description for staff')
      expect(response.body.closed).toEqual(true)
      done()
    })
  })

  test('It should retrieve an task', (done) => {
    request(app).get('/task/1')
      .set('Authorization', admintToken)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.id).not.toBeNull()
        expect(response.body.description).toEqual('Test task description for admin')
        expect(response.body.closed).toEqual(true)
        done()
    })
  })

  test('It should avoid to staff user retrieve an admin task', (done) => {
    request(app).get('/task/1')
      .set('Authorization', staffToken)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeNull()
        done()
    })
  })

  test('It should avoid to staff user delete an task', (done) => {
    request(app).delete('/task/2')
      .set('Authorization', staffToken)
      .then((response) => {
        expect(response.statusCode).toBe(403);
        done()
    })
  })

  test('It should allow to admin user delete an task', (done) => {
    request(app).delete('/task/2')
      .set('Authorization', admintToken)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done()
    })
  })


})