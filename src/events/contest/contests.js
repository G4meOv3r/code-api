import Contest from '../../models/Contest'

const onContestsSubscribe = (data, socket) => {
    const unsubscribe = Contest.subscribe((data) => {
        if (data.fullDocument.privacy.access === 0) {
            socket.emit('contests:update', data.fullDocument)
        }
    })
    socket.once('contests:unsubscribe', () => {
        unsubscribe()
    })
}

export default onContestsSubscribe
