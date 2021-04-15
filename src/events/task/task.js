import Package from '../../models/Package'

const onTaskSubscribe = async (data, socket) => {
    const { _id } = data
    const { user } = socket

    const unsubscribePackages = Package.subscribe((data) => {
        if (data.fullDocument.task.equals(_id) && data.fullDocument.creator.equals(user._id)) {
            socket.emit(`task:${_id}:update`, data.fullDocument)
        }
    })

    socket.on(`task:${_id}:unsubscribe`, () => {
        unsubscribePackages()
    })
}

export default onTaskSubscribe
