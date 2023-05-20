import { expect } from '@jest/globals';
import request from 'supertest'
import { app } from '../server'

interface IData {
    datas: string[]
}
//TODO: CRIAR TODA ESTRUTURA DE TESTES
let mockData: IData[]

beforeEach(() => {
    mockData = [{
        "datas": [
            "Dado de registro TESTE",
            "Dado de registro TESTE 2"
        ]
    },
    {
        "datas": [
            "Segundo exemmplo de registro TESTE",
            "Dado de registro TESTE 2"
        ]
    }]
})


describe('Tests in Ledger Controller', () => {
    test('should be status 200', async () => {
        const response = await request(app)
            .post('/')
            .send(mockData[0])
        expect(response.status).toEqual(200)
    })

    test('should response be a Object', async () => {
        const req = await request(app)
            .post('/')
            .send(mockData[0])
        expect(typeof req.body).toBe('object')
    })

    test('should be possible to register a block', async () => {
        const req = await request(app)
            .post('/')
            .send(mockData[0])
        expect(req.body).toMatchObject({
            ...mockData[0],
            hash: expect.any(String),
            blockNumber: expect.any(Number),
            createdAt: expect.any(String),
            id: expect.any(String)
        })
    })
})