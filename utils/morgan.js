
import morgan from "morgan"
import fs from "fs"
import moment from "moment";

const requestLogStream = fs.createWriteStream('./logs/requests.log', { flags: 'a' })

morgan.token('user_id', function (req) {
    return req.user_id
})

morgan.token('body', function (req) {
    return JSON.stringify(req.body)
})

morgan.token('timestamp', function () {
    return moment().format('h:mm:ss a, MMMM Do YYYY')
})

morgan.token('resp', function (req, resp) {
    return JSON.stringify(resp.body);
})

morgan.token('custom', function (req, resp) {
    return JSON.stringify(resp.custom || {});
})

morgan.token('error', function (req, resp) {
    return JSON.stringify(resp.error || null);
})

export default morgan('{"timestamp"\: ":timestamp", "user_id"\: ":user_id", "method"\: ":method", "url"\: ":url", "response-time"\: ":response-time", "body"\: :body, "resp"\: :resp, "custom"\: :custom, "error"\: :error }', { stream: requestLogStream })