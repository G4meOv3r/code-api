export const subscribable = (model) => {
    model.subscribers = {}

    model.watch().on('change', (data) => {
        for (const sub in model.subscribers) {
            console.log(sub, data)
        }
    })

    model.subscribe = (handler) => {
        console.log(model.subscribers)
        model.subscribers[Date.now()] = handler
        console.log(`subscribe on ${model}`)
    }
    return model
}
