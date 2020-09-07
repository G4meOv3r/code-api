const ping = (req, res, next) => {
	return res.send("pong");
}

export default {
	ping
};