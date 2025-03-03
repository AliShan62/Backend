
module.exports = (TheFun) => (req, res, next) => {

    Promise.resolve(TheFun(req, res, next)).catch(next)
}