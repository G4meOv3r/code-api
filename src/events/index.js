import onDisconnect from './disconnect'
import lobbyHandlers from './lobby'

const onConnection = (socket) => {
    socket.on('disconnect', onDisconnect)

    socket.on('lobby:subscribe', (reason) => {
        lobbyHandlers.subscribe(reason)
        socket.once('lobby:unsubscribe', (reason) => {
            console.log('unsubscribe')
        })
    })

    socket.on('click', (socket) => { console.log(1) })
}

export default onConnection
