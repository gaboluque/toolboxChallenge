const { app } = require('./app')

const start = async () => {
  app.listen(3001, () => {
    console.log('Server listening in port 3001')
  })
}

start()
