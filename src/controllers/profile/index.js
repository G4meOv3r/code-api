import profile from './profile'
import friends from './friends/friends'
import invite from './friends/invite'
import remove from './friends/remove'
import personal from './personal'
import root from './root'

export default {
    profile: {
        get: profile,
        post: root
    },
    friends: {
        get: friends,
        invite: {
            post: invite
        },
        remove: {
            post: remove
        }
    },
    personal: {
        get: personal
    }
}
