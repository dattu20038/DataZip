# DataZip
DataZip is a web-based file compression and decompression tool that uses the Huffman coding algorithm. The tool allows users to compress files into a .huff format and decompress them back to their original state
eatures

File Compression: Upload a file and compress it using Huffman coding.

File Decompression: Decompress the compressed .huff file back to its original format.

Download Options: Download both compressed and decompressed files.

Technologies Used

HTML

CSS

JavaScript

How to Use

Clone the repository:

git clone https://github.com/your-username/DataZip.git

Navigate to the project directory:

cd DataZip

Open the index.html file in your browser to launch the application.

Project Structure

DataZip/
├── index.html         # Main HTML file
├── style.css          # CSS file for styling
├── script.js          # JavaScript file for functionality
└── README.md          # Project documentation

Detailed Explanation

HuffmanNode Class

The HuffmanNode class represents a node in the Huffman tree. Each node contains:

byte: The data (character or byte).

freq: The frequency of the data.

left and right: Pointers to child nodes.

PriorityQueue Class

The PriorityQueue class is implemented using a min-heap to manage the nodes based on their frequency.

Core Functions

calculateFrequency(data)

Calculates the frequency of each byte in the input data.

buildHuffmanTree(frequency)

Builds the Huffman tree using the calculated frequency map.

generateCodes(node, currentCode)

Generates Huffman codes for each byte by traversing the Huffman tree.

compress(data)

Compresses the input data using the generated Huffman codes and returns a compressed buffer.

decompress(buffer)

Decompresses the compressed buffer using the Huffman tree and returns the original data.

UI Elements

File Input: Allows users to upload a file.

Compress Button: Compresses the uploaded file.

Download Compressed File Button: Downloads the compressed file.

Decompress Button: Decompresses the compressed file.

Download Decompressed File Button: Downloads the decompressed file.

Styling

The UI is styled with a modern and responsive design:

Linear gradient background.

Styled buttons with hover and active effects.

Responsive design for different screen sizes.

Future Improvements

Support for multiple file formats.

Display compression ratio and statistics.

Drag-and-drop file upload feature.
