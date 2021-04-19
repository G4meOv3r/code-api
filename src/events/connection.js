import onContestsSubscribe from './contest/contests'
import onContestSubscribe from './contest/contest'
import onTaskSubscribe from './task/task'
import onPackageSubscribe from './packages/package'
import onProfilesSubscribe from './profiles/profiles'
import onSearchSubscribe from './search/search'

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
    socket.on('profiles:subscribe', data => onProfilesSubscribe(data, socket))
    socket.on('search:subscribe', data => onSearchSubscribe(data, socket))
}

export default onConnection
