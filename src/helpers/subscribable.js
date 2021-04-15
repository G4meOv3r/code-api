export const subscribable = (model) => {
    model.subscribers = {}

    model.watch().on('change', async (data) => {
        if (!data.fullDocument) {
            data.fullDocument = await model.findOne({ _id: data.documentKey })
        }
        for (const id in model.subscribers) {
            model.subscribers[id](data)
        }
    })

    model.subscribe = (handler) => {
        const id = Date.now()
        model.subscribers[id] = handler
        return () => {
            delete model.subscribers[id]
        }
    }
    return model
}
