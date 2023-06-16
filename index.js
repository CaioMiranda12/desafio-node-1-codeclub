const express = require('express')
const port = 3000
const uuid = require('uuid')

const app = express()
app.use(express.json())

const orders = []

//Middleware do ID
const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(user => user.id === id)

    if(index < 0) {
        return response.status(404).json({ message: "error: order not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}

const methodURL = (request, response, next) => {
    const { method } = request
    const { url } = request

    console.log(`[${method}] - ${url}`)

    next()
}


app.get('/order', methodURL, (request, response) => {
    return response.json(orders)
})

app.post('/order', methodURL, (request, response) => {
    const { order, clientName, price } = request.body
    const userOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    orders.push(userOrder)

    return response.status(201).json(userOrder)
})

app.put('/order/:id', checkUserId, methodURL, (request, response) => {
    const index = request.userIndex
    const id = request.userId

    const { order, clientName, price } = request.body

    const newOrder = { id, order, clientName, price, status: "Em preparação"}

    orders[index] = newOrder

    return response.json(newOrder)
})

app.delete('/order/:id', checkUserId, methodURL, (request, response) => {
    const index = request.userIndex

    orders.splice(index, 1)

    return response.status(204).json(orders)
})

app.get('/order/:id', checkUserId, methodURL, (request, response) => {
    const index = request.userIndex
    
    const order = orders[index].order

    return response.json({Pedido: order})

})

app.patch('/order/:id', checkUserId, methodURL, (request, response) => {
    const index = request.userIndex
    
    orders[index].status = "Pronto"

    return response.json(orders[index])
})



app.listen(port, () => {
    console.log(`⚡ Server started on port ${port}`)
})