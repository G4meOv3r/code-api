import Contest from '../../models/Contest'

const onContestsSubscribe = (data, socket) => {
    const unsubscribe = Contest.subscribe((data) => {
        socket.emit('contests:update', data.fullDocument)
    })
    socket.once('contests:unsubscribe', () => {
        unsubscribe()
    })
}

export default onContestsSubscribe
