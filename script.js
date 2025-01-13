class HuffmanNode {
    constructor(byte, freq) {
        this.byte = byte; 
        this.freq = freq;
        this.left = null;
        this.right = null;
    }
}

// Priority Queue using a Min-Heap
class PriorityQueue {
    constructor() {
        this.nodes = [];
    }

    enqueue(node) {
        this.nodes.push(node);
        this.nodes.sort((a, b) => a.freq - b.freq); 
    }

    dequeue() {
        return this.nodes.shift();
    }

    isEmpty() {
        return this.nodes.length === 0;
    }
}

let huffmanCodes = {};
let huffmanTree = null;
let originalFileName = "";
let compressedFile = null;
let decompressedFile = null;

function calculateFrequency(data) {
    const frequency = new Map();
    for (let byte of data) {
        frequency.set(byte, (frequency.get(byte) || 0) + 1);
    }
    return frequency;
}

function buildHuffmanTree(frequency) {
    const priorityQueue = new PriorityQueue();

    frequency.forEach((freq, byte) => {
        priorityQueue.enqueue(new HuffmanNode(byte, freq));
    });

    while (priorityQueue.nodes.length > 1) {
        const left = priorityQueue.dequeue();
        const right = priorityQueue.dequeue();
        const newNode = new HuffmanNode(null, left.freq + right.freq);
        newNode.left = left;
        newNode.right = right;
        priorityQueue.enqueue(newNode);
    }

    return priorityQueue.dequeue();
}

function generateCodes(node, currentCode) {
    if (!node) return;
    if (node.byte !== null) {
        huffmanCodes[node.byte] = currentCode;
    }
    generateCodes(node.left, currentCode + "0");
    generateCodes(node.right, currentCode + "1");
}

function compress(data) {
    const frequency = calculateFrequency(data);
    huffmanTree = buildHuffmanTree(frequency);
    huffmanCodes = {};
    generateCodes(huffmanTree, "");

    let compressed = "";
    for (let byte of data) {
        compressed += huffmanCodes[byte];
    }

    const buffer = new Uint8Array(Math.ceil(compressed.length / 8));
    for (let i = 0; i < compressed.length; i++) {
        const bytePos = Math.floor(i / 8);
        const bitPos = i % 8;
        if (compressed[i] === "1") {
            buffer[bytePos] |= (1 << (7 - bitPos));
        }
    }

    return buffer;
}

function decompress(buffer) {
    let binaryString = "";
    for (let byte of buffer) {
        binaryString += byte.toString(2).padStart(8, "0");
    }

    let decoded = [];
    let node = huffmanTree;
    for (let bit of binaryString) {
        node = (bit === "0") ? node.left : node.right;
        if (node.left === null && node.right === null) {
            decoded.push(node.byte);
            node = huffmanTree;
        }
    }

    return new Uint8Array(decoded);
}

document.getElementById("compressBtn").addEventListener("click", function () {
    const fileInput = document.getElementById("fileInput").files[0];
    if (fileInput) {
        originalFileName = fileInput.name;
        const reader = new FileReader();
        reader.onload = function (event) {
            const arrayBuffer = new Uint8Array(event.target.result);
            compressedFile = compress(arrayBuffer);
            alert("File compressed successfully.");
        };
        reader.readAsArrayBuffer(fileInput);
    } else {
        alert("Please select a file first!");
    }
});

document.getElementById("downloadCompressedBtn").addEventListener("click", function () {
    if (compressedFile) {
        const blob = new Blob([compressedFile], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = originalFileName + ".huff";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        alert("Please compress a file first!");
    }
});

document.getElementById("decompressBtn").addEventListener("click", function () {
    if (compressedFile) {
        decompressedFile = decompress(compressedFile);
        alert("File decompressed successfully.");
    } else {
        alert("Please compress a file first!");
    }
});

document.getElementById("downloadDecompressedBtn").addEventListener("click", function () {
    if (decompressedFile) {
        const blob = new Blob([decompressedFile], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = originalFileName.replace(".huff", "");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        alert("Please decompress a file first!");
    }
});
