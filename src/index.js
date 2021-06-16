//Aluno: João Pedro de Rossi Tambasco Calazans
//Matrícula: 202010405

const { request, response } = require('express')
const express = require('express')
const app = express()
app.use(express.json())

const uuid = require('uuid')

let compras = [
    {id: uuid.v4(), dataCompra: '2021/06/14', localCompra:'Extra', valor: 50.0, responsavel: 'João Pedro'},
    {id: uuid.v4(), dataCompra: '2021/05/10', localCompra:'Sendas', valor: 25.0, responsavel: 'Maria Clara'}
]

//middlewares
const checkID = (request,response,next) => {
    const {id} = request.params;
    const compraID = compras.find(compra => compra.id === id)

    if (!compraID){
        return response
            .status(400)
            .json({error: 'Id Inexistente'})
    }
    return next()
}

const verificaCompra = (request,response,next) => {
    const {dataCompra,localCompra,valor,responsavel} = request.body;

    if (!dataCompra||!localCompra||!valor||!responsavel){
        return response
            .status(400)
            .json({error: 'Um ou mais campos não foram preenchidos!'})
    }
    return next()
}




//Inserir Despesa
app.post('/despesas', verificaCompra, (request,response) => {
    const {dataCompra,localCompra,valor,responsavel} = request.body;
    const dadosCompra = {
        id: uuid.v4(),
        dataCompra,
        localCompra,
        valor,
        responsavel
    }
    compras = [...compras,dadosCompra]
        return response
                .status(200)
                .json(dadosCompra)

})



//listar todas as despesas
app.get('/despesas/',(request,response) =>{
    return response
            .status(200)
            .json(compras)
})


//Pegar o total de todas as despesas
app.get('/despesas/gastototal',(request,response) => {
    const gastoTotal = compras.reduce((total,comp) => total += comp.valor,0)
    return response
        .status(200)
        .json({"Gasto Total": gastoTotal})
})



//Pegar todas as despesas de x funcionario
app.get('/despesas/gastoresponsavel',(request,response) =>{
    const {responsavel} = request.query;
    const totalDespesa = compras.filter(comp => comp.responsavel === responsavel)
    return response
        .status(200)
        .json(totalDespesa)
})



//Listar despesa por ID
app.get('/despesas/:id', checkID,(request,response) => {
    const {id} = request.params;
    const compraID = compras.filter(compra => compra.id === id)
    return response
        .status(200)
        .json(compraID)

})



app.listen(3333,() => {
    console.log('Servidor Rodando...')
})