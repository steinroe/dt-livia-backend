'use strict'
const app = require('./config/express')
const PORT = process.env.PORT || 4000

// listen to requests
app.listen(PORT, () => console.log('livia-backend listening on port ' + PORT))
