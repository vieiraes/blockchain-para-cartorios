"use strict";

//import blockExecute from './block.js'
//array da blockchain
var blockChainArray = [{
  atributo: "algo"
}, "", true];

function writeToChain(data) {
  return blockChainArray.push(data);
}

var logs = writeToChain(blockChainArray);
console.log(logs);
console.log("aqui blockChainArray", blockChainArray);
console.log("aqui blockCreated", blockCreated);
module.exports = blockChainArray;

function verifyChain() {}

function createChain() {
  object = {
    index: block.index,
    timestamp: block.timestamp,
    data: block.data,
    previousHash: block.previousHash
  };
}