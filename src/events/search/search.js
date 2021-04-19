import Searcher from '../../models/Searcher'

const onSearchSubscribe = async (data, socket) => {
    const { user } = socket

    const unsubscribePackages = Searcher.subscribe(async (data) => {
        let inSearch = false
        let date = null
        let contest = null
        if (data.fullDocument && data.fullDocument.searcher.equals(user._id)) {
            inSearch = true
            date = data.fullDocument.date
            contest = data.fullDocument.contest
        } else {
            const searcher = await Searcher.findOne({ searcher: user._id })
            if (searcher) {
                inSearch = true
                date = searcher.date
                contest = searcher.contest
            }
        }
        socket.emit('search:update', { inSearch, searchers: (await Searcher.countDocuments()), date, contest })
    })

    socket.once('search:unsubscribe', () => {
        unsubscribePackages()
    })
}

export default onSearchSubscribe
