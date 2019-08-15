import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'jwtsecretword'
const options = {
  expiresIn: '1d'
}

export const generateToken = (user, response) => {
  if (user) {
    let payload = user.get({
      plain: true
    })
    delete payload.password
    const secret = process.env.JWT_SECRET || 'jwtsecretword'
    const token = jwt.sign(payload, secret, options)
    response.json({ token })
  } else {
    response.status(401).json({ status: 401, error: 'Authentication error' })
  }
}

export const validateToken = (req, res, next) => {
  const authorizationHeaader = req.headers.authorization
  let result
  if (authorizationHeaader) {
    const token = req.headers.authorization.split(' ')[1] // Bearer <token>
    try {
      result = jwt.verify(token, secret, options)
      req.user = result
      req.isAdmin = result.role === 'admin'
      next()
    } catch (err) {
      throw new Error(err)
    }
  } else {
    result = {
      error: `Authentication error. Token required.`,
      status: 401
    }
    res.status(401).json(result)
  }
}
