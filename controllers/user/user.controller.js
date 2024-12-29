const helloWorld = (req, resp)=>{
    return resp.json({greeting: "Hello world"})
}

export default { helloWorld };