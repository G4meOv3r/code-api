import create from './create'
import start from './start'
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
    }
}
