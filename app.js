import mongoose from 'mongoose'
import httpServer from './index'

mongoose.connect(
    process.env.NODE_ENV === 'test'
        ? process.env.MONGO_TEST_URI
        : process.env.MONGO_URI,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true
    }
)

mongoose.connection.once('open', () => {
    const port = process.env.PORT || 3012

    httpServer.listen(port, () => {
        console.log(`App started at port ${port}`)
    })
})

mongoose.connection.on('error', (err) => {
    console.log(err)
})
