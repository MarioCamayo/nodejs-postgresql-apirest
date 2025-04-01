import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { PORT } from './config.js'
import usersRoutes from './routes/users.routes.js'

const app = express()
// const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res)=>{
  res.send('<h1></h1>Server is running 2025</h1>')
})
// console.log('donde voy a vivir próximamente en',process.env.ADD)


app.use('/api/v1',usersRoutes)


app.listen(PORT, ()=>{
  console.log(`listening in http://localhost:${PORT}`)
})