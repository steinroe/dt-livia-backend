const moment = require('moment')

enhanceNotesWithLinks({
    title: 'My First Appointment Note',
    content: 'The doctor just came in and told me I defeated the cancer!',
    timestamp: moment().toString()
})