"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blockChainArray = void 0;

var _server = require("./server.js");

//INITIALIZE SERVER
(0, _server.startServer)(); //blockchain array DB

var blockChainArray = [];
exports.blockChainArray = blockChainArray;

function writeToChain(data) {
  blockChainArray.push(data);
  return console.log(blockChainArray);
}

function verifyChain() {}

function createChain() {
  object = {
    index: blockObject.index,
    timestamp: blockObject.timestamp,
    previousHash: blockObject.previousHash,
    datas: blockObject.datas
  };
}