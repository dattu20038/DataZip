# DataZip

**DataZip** is a file compression and decompression tool that allows users to upload files, select compression levels, and perform compression or decompression operations using Huffman coding. It supports a drag-and-drop interface for file uploads and offers real-time progress tracking.

## Features

- **Drag & Drop Upload**: Easily drag and drop files or click to select files for compression or decompression.
- **Compression Levels**: Choose between `Fastest`, `Balanced`, or `Maximum` compression levels.
- **Theme Toggle**: Switch between light and dark modes for a better user experience.
- **Real-Time Progress**: Visual progress bars for both individual files and overall operations.
- **Compression Statistics**: View detailed statistics, including total files, file size, and space saved.
- **File Management**: Add, remove, and clear files before starting operations.

## Technologies Used

- **Frontend**:
  - HTML5
  - CSS3 (with custom variables for theming)
  - JavaScript (for handling the logic)
  - Font Awesome for icons

- **Backend**:
  - **Huffman Coding** for file compression
  - **Priority Queue** for building Huffman Tree
  - **Blob API** for generating downloadable files

## Installation

To run **DataZip** locally:

1. Clone this repository to your local machine:
    ```bash
    git clone https://github.com/yourusername/datazip.git
    ```
2. Navigate to the project directory:
    ```bash
    cd datazip
    ```
3. Open the `index.html` file in a web browser to start using the application.

### Dependencies

No external dependencies are required. All files are self-contained.

## How It Works

1. **File Upload**: Users can upload files either through the drag-and-drop area or by selecting files through the file input.
2. **Compression Options**: Users can select their preferred compression level from three options: `Fastest`, `Balanced`, and `Maximum`. The `Fastest` option prioritizes speed over compression ratio, while the `Maximum` option provides the highest compression at the cost of longer processing time.
3. **Processing Files**: Files are processed in chunks, and their compression or decompression progress is displayed in real-time. Once complete, users can download the resulting files.
4. **Error Handling**: Errors such as exceeding file size limits are displayed to the user in a clear, informative manner.

## Demo

You can view a live demo of the DataZip application at the following link:

[DataZip Demo](https://data-zip-dat.vercel.app/)

## Usage

- **Compress Files**: Select files, choose a compression level, and click on the "Compress Files" button. The system will compress the files and provide a downloadable link.
- **Decompress Files**: Select compressed files (`.huff` extension) and click on the "Decompress Files" button to extract the original content.
- **Clear Files**: Clear all files from the current session by clicking the "Clear All" button.



**Note**: Ensure to replace any placeholders (e.g., GitHub username, demo link) with your actual details before using this README.
