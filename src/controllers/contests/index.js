import create from './create'
import start from './start'
import connect from './connect'
import root from './root'

export default {
    root: {
        get: root
    },
    create: {
        post: create
    },
    start: {
        get: start
    },
    connect: {
        get: connect
    }
}
