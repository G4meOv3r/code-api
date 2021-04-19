import User from '../../models/User'

const onProfilesSubscribe = async (data, socket) => {
    const unsubscribeProfiles = User.subscribe((data) => {
        const { nickname, name, lastName, status } = data.fullDocument.personal
        socket.emit('profiles:update', { _id: data.fullDocument._id, nickname, name, lastName, status })
    })

    socket.once('profiles:unsubscribe', () => {
        unsubscribeProfiles()
    })
}

export default onProfilesSubscribe
