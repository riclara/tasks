import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import Routes from './routes'
import { sync } from './models'

const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', Routes)

export default app.listen(port, (err) => {
  if (err) {
    return console.log('Error on load server: ', err)
  }
  sync().then(() => {
    console.log(`Server is running and listening on ${port}`)
  })
})
