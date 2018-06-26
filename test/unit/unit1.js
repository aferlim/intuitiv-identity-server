const chai = require('chai').use(require('chai-as-promised'))
const { expect } = chai

const sum = require('../../src/lib/coverage-test')

describe('Simple tests', () => {
    it('Deve somar corretamente', () => {
        var c = sum(10, 15)

        expect(c).to.equal(25)
    })
})
