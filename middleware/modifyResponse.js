const modifyResponse = async (req, resp, next) => {
    const json = resp.json;
    resp.json = async (body) => {
        const { cacheKey = null } = resp;
        const { redisClient } = global;
        if (cacheKey != null) {
            await redisClient.set(cacheKey, JSON.stringify(body), { EX: 5 * 60 });
        }

        const { message = "", status = resp.statusCode, data = {} } = body;
        body = { status: { success: (status >= 200 && status < 300), code: status, message }, data };
        resp.body = body;
        return json.call(resp, body);
    }
    next();
}

export default modifyResponse;