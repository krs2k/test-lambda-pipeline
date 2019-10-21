module.exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: process.env.NODE_ENV + " " + process.env.VERSION
    }
};
