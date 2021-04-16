import onContestsSubscribe from './contest/contests'
import onContestSubscribe from './contest/contest'
import onTaskSubscribe from './task/task'
import onPackageSubscribe from './pacakges/package'

const onConnection = async (socket) => {
    const { user } = socket
    if (user) {
        user.personal.status = 0
        user.markModified('personal')
        user.save()
    }
    socket.on('disconnect', async (data) => {
        if (user) {
            user.personal.status = 1
            user.markModified('personal')
            user.save()
        }
    })
    socket.on('contests:subscribe', data => onContestsSubscribe(data, socket))
    socket.on('contest:subscribe', data => onContestSubscribe(data, socket))
    socket.on('task:subscribe', data => onTaskSubscribe(data, socket))
    socket.on('package:subscribe', data => onPackageSubscribe(data, socket))
}

export default onConnection
