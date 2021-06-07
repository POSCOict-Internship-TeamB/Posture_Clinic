const Logger = store => next => action =>{
    console.log(action)
    const result = next(action)
    return result
}

export default Logger   