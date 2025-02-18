// Main application class
class DataZipApp {
    constructor() {
        this.compression = new HuffmanCompression();
        this.files = new Map();
        this.isDarkMode = false;
        this.maxFileSize = 100 * 1024 * 1024; // 100MB
        this.initializeUI();
    }

    initializeUI() {
        // Theme toggle
        this.themeToggle = document.getElementById('themeToggle');
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Drop zone
        this.dropZone = document.getElementById('dropZone');
        this.setupDropZone();

        // File input
        this.fileInput = document.getElementById('fileInput');
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Compression options
        this.setupCompressionOptions();

        // Action buttons
        this.setupActionButtons();

        // Initialize stats
        this.statsPanel = document.getElementById('statsPanel');
        this.updateStats();
    }

    setupDropZone() {
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('drag-over');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            this.handleFiles(e.dataTransfer.files);
        });

        this.dropZone.addEventListener('click', () => {
            this.fileInput.click();
        });
    }

    setupCompressionOptions() {
        document.querySelectorAll('input[name="compression"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.compression.setCompressionLevel(e.target.value);
            });
        });
    }

    setupActionButtons() {
        document.getElementById('compressBtn').addEventListener('click', () => this.processFiles(true));
        document.getElementById('decompressBtn').addEventListener('click', () => this.processFiles(false));
        document.getElementById('clearBtn').addEventListener('click', () => this.clearFiles());
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
        const icon = this.themeToggle.querySelector('i');
        icon.className = this.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }

    async handleFiles(fileList) {
        for (let file of fileList) {
            if (file.size > this.maxFileSize) {
                this.showError(`File ${file.name} exceeds maximum size limit of 100MB`);
                continue;
            }

            const fileId = Math.random().toString(36).substr(2, 9);
            this.files.set(fileId, file);
            await this.displayFileInfo(file, fileId);
        }
        this.updateStats();
    }

    async displayFileInfo(file, fileId) {
        const fileList = document.getElementById('fileList');
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.id = `file-${fileId}`;

        const fileSize = this.formatSize(file.size);
        // Continuing from previous code...
        const estimatedCompressedSize = this.formatSize(Math.round(file.size * 0.7));

        fileItem.innerHTML = `
            <div class="file-header">
                <h3>${file.name}</h3>
                <button class="remove-file" data-id="${fileId}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="file-info">
                <div class="info-item">
                    <strong>Size:</strong> ${fileSize}
                </div>
                <div class="info-item">
                    <strong>Type:</strong> ${file.type || 'Unknown'}
                </div>
                <div class="info-item">
                    <strong>Est. Compressed:</strong> ${estimatedCompressedSize}
                </div>
            </div>
            <div class="progress-bar" style="display: none">
                <div class="progress-bar-fill"></div>
                <div class="progress-text">0%</div>
            </div>
        `;

        fileItem.querySelector('.remove-file').addEventListener('click', () => {
            this.removeFile(fileId);
        });

        fileList.appendChild(fileItem);
    }

    removeFile(fileId) {
        this.files.delete(fileId);
        document.getElementById(`file-${fileId}`).remove();
        this.updateStats();
    }

    clearFiles() {
        this.files.clear();
        document.getElementById('fileList').innerHTML = '';
        this.updateStats();
    }

    updateStats() {
        const totalFiles = this.files.size;
        const totalSize = Array.from(this.files.values()).reduce((sum, file) => sum + file.size, 0);
        const estimatedCompressedSize = Math.round(totalSize * 0.7);
        const spaceSaved = totalSize - estimatedCompressedSize;

        document.getElementById('totalFiles').textContent = totalFiles;
        document.getElementById('totalSize').textContent = this.formatSize(totalSize);
        document.getElementById('compressedSize').textContent = this.formatSize(estimatedCompressedSize);
        document.getElementById('spaceSaved').textContent = this.formatSize(spaceSaved);
    }

    formatSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        document.querySelector('.container').insertBefore(errorDiv, this.statsPanel);
        setTimeout(() => errorDiv.remove(), 5000);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.querySelector('.container').insertBefore(successDiv, this.statsPanel);
        setTimeout(() => successDiv.remove(), 5000);
    }

    async processFiles(isCompression) {
        if (this.files.size === 0) {
            this.showError('Please add files first!');
            return;
        }

        const globalProgress = document.querySelector('.global-progress');
        globalProgress.style.display = 'block';
        const globalProgressFill = globalProgress.querySelector('.progress-bar-fill');
        const globalProgressText = globalProgress.querySelector('.progress-text');

        let processed = 0;
        for (const [fileId, file] of this.files) {
            const fileElement = document.getElementById(`file-${fileId}`);
            const progressBar = fileElement.querySelector('.progress-bar');
            const progressFill = progressBar.querySelector('.progress-bar-fill');
            const progressText = progressBar.querySelector('.progress-text');
            
            progressBar.style.display = 'block';
            
            try {
                const arrayBuffer = await file.arrayBuffer();
                const data = new Uint8Array(arrayBuffer);
                
                // Process the file in chunks for better performance
                const chunkSize = 1024 * 1024; // 1MB chunks
                const totalChunks = Math.ceil(data.length / chunkSize);
                let processedChunks = 0;

                const processChunk = async (start) => {
                    const end = Math.min(start + chunkSize, data.length);
                    const chunk = data.slice(start, end);
                    
                    const result = isCompression ? 
                        await this.compression.compressChunk(chunk) :
                        await this.compression.decompressChunk(chunk);
                    
                    processedChunks++;
                    const progress = (processedChunks / totalChunks) * 100;
                    progressFill.style.width = `${progress}%`;
                    progressText.textContent = `${Math.round(progress)}%`;
                    
                    return result;
                };

                const chunks = [];
                for (let i = 0; i < data.length; i += chunkSize) {
                    chunks.push(await processChunk(i));
                }

                const finalResult = await this.compression.combineChunks(chunks);
                
                // Create download
                const blob = new Blob([finalResult]);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = isCompression ? `${file.name}.huff` : file.name.replace('.huff', '');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                processed++;
                const totalProgress = (processed / this.files.size) * 100;
                globalProgressFill.style.width = `${totalProgress}%`;
                globalProgressText.textContent = `${Math.round(totalProgress)}%`;

                this.showSuccess(`${file.name} ${isCompression ? 'compressed' : 'decompressed'} successfully!`);

            } catch (error) {
                progressBar.style.display = 'none';
                this.showError(`Error processing ${file.name}: ${error.message}`);
            }
        }
    }
}

// Enhanced Huffman Compression Class
class HuffmanCompression {
    constructor() {
        this.compressionLevel = 'balanced';
        this.huffmanCodes = {};
        this.huffmanTree = null;
    }

    setCompressionLevel(level) {
        this.compressionLevel = level;
    }

    calculateFrequency(data) {
        const frequency = new Map();
        for (let byte of data) {
            frequency.set(byte, (frequency.get(byte) || 0) + 1);
        }
        return frequency;
    }

    buildHuffmanTree(frequency) {
        const priorityQueue = new PriorityQueue();
        
        frequency.forEach((freq, byte) => {
            priorityQueue.enqueue(new HuffmanNode(byte, freq));
        });

        while (priorityQueue.size() > 1) {
            const left = priorityQueue.dequeue();
            const right = priorityQueue.dequeue();
            const parent = new HuffmanNode(null, left.frequency + right.frequency);
            parent.left = left;
            parent.right = right;
            priorityQueue.enqueue(parent);
        }

        return priorityQueue.dequeue();
    }

    generateCodes(node, code = '') {
        if (!node) return;
        
        if (node.byte !== null) {
            this.huffmanCodes[node.byte] = code;
            return;
        }

        this.generateCodes(node.left, code + '0');
        this.generateCodes(node.right, code + '1');
    }

    async compressChunk(data) {
        const frequency = this.calculateFrequency(data);
        this.huffmanTree = this.buildHuffmanTree(frequency);
        this.huffmanCodes = {};
        this.generateCodes(this.huffmanTree);

        // Create header with frequency table
        const header = this.createHeader(frequency);
        
        // Compress data
        let compressed = '';
        for (let byte of data) {
            compressed += this.huffmanCodes[byte];
        }

        // Convert binary string to Uint8Array
        const compressedData = this.binaryStringToUint8Array(compressed);
        
        // Combine header and compressed data
        return this.combineHeaderAndData(header, compressedData);
    }

    async decompressChunk(data) {
        const { frequency, compressedData } = this.extractHeader(data);
        this.huffmanTree = this.buildHuffmanTree(frequency);
        
        return this.decompressData(compressedData);
    }

    createHeader(frequency) {
        const header = [];
        frequency.forEach((freq, byte) => {
            header.push(byte, freq);
        });
        return new Uint8Array(header);
    }

    extractHeader(data) {
        // First 4 bytes contain header length
        const headerLength = new DataView(data.buffer).getUint32(0);
        const header = data.slice(4, 4 + headerLength);
        
        // Reconstruct frequency table
        const frequency = new Map();
        for (let i = 0; i < header.length; i += 2) {
            frequency.set(header[i], header[i + 1]);
        }
        
        return {
            frequency,
            compressedData: data.slice(4 + headerLength)
        };
    }

    binaryStringToUint8Array(binaryString) {
        const result = new Uint8Array(Math.ceil(binaryString.length / 8));
        for (let i = 0; i < binaryString.length; i += 8) {
            const byte = binaryString.slice(i, i + 8).padEnd(8, '0');
            result[i / 8] = parseInt(byte, 2);
        }
        return result;
    }

    combineHeaderAndData(header, data) {
        const headerLength = header.length;
        const result = new Uint8Array(4 + headerLength + data.length);
        
        // Store header length
        new DataView(result.buffer).setUint32(0, headerLength);
        
        // Copy header and data
        result.set(header, 4);
        result.set(data, 4 + headerLength);
        
        return result;
    }

    async combineChunks(chunks) {
        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        
        let offset = 0;
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }
        
        return result;
    }

    decompressData(compressedData) {
        let current = this.huffmanTree;
        const decompressed = [];
        let binaryString = '';
        
        // Convert compressed data to binary string
        for (let byte of compressedData) {
            binaryString += byte.toString(2).padStart(8, '0');
        }
        
        for (let bit of binaryString) {
            if (!current) break;
            
            current = bit === '0' ? current.left : current.right;
            
            if (current.byte !== null) {
                decompressed.push(current.byte);
                current = this.huffmanTree;
            }
        }
        
        return new Uint8Array(decompressed);
    }
}

// Helper Classes
class HuffmanNode {
    constructor(byte, frequency) {
        this.byte = byte;
        this.frequency = frequency;
        this.left = null;
        this.right = null;
    }
}

class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(node) {
        this.queue.push(node);
        this.queue.sort((a, b) => a.frequency - b.frequency);
    }

    dequeue() {
        return this.queue.shift();
    }

    size() {
        return this.queue.length;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    new DataZipApp();
});
