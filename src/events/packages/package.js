import Package from '../../models/Package'

const onPackageSubscribe = async (data, socket) => {
    const { _id } = data
    const { user } = socket

    const unsubscribePackages = Package.subscribe((data) => {
        if (data.fullDocument._id.equals(_id) && data.fullDocument.creator.equals(user._id)) {
            socket.emit(`package:${_id}:update`, data.fullDocument)
        }
    })

    socket.once(`package:${_id}:unsubscribe`, () => {
        unsubscribePackages()
    })
}

export default onPackageSubscribe
