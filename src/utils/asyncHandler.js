//2nd method to error handler syntax
const asynHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) =>next(err))
    }
}

export { asynHandler }



//1st method to error handler syntax
/*
const asynHandler=({fn}) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.code ||500).json({
            success: false,
            message : error.message
        })
    }
}
*/