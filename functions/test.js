const moment = require('moment')

enhanceNotesWithLinks({
    title: 'My First Appointment Note',
    content: 'The doctor just came in and told me I defeated the cancer!',
    timestamp: moment().toString()
})

enhanceNotesWithLinks({
    title: 'My Second Note',
    content: 'I have a condom on my head!',
    timestamp: moment().toString()
})

enhanceNotesWithLinks({
    title: 'I am sleeping bad',
    content: 'My sleep got worse!',
    timestamp: moment().toString()
})