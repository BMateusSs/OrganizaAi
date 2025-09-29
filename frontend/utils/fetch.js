async function fetch(url, config){
    try{
        const response = await fetch(url, config)
        const data = await response.json()

        if (!response.ok){
            return {data: null, error: response.message}
        }

        return {data: data, error: null}

    }catch(err){
        return {data: null, error: err.message}
    }
}

export default fetch