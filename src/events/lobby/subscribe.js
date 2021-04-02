import User from '../../models/User'

const subscribeLobby = (reason) => {
    console.log('subscribe')
    User.subscribe(() => {})
}

export default subscribeLobby
