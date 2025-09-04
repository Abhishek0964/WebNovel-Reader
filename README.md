# 📖 Offline Webnovel Reader

A client-side React application for reading text files offline with customizable themes, font sizes, and automatic progress saving.

## Features

- **File Upload**: Upload multiple .txt files to create your personal library
- **Bookshelf UI**: Visual library showing all uploaded books with file sizes
- **Reading Experience**: 
  - Adjustable font size (12px - 36px)
  - Three themes: Light, Dark, and Sepia
  - Smooth scrolling with position memory
- **Persistence**: 
  - Uploaded books saved in localStorage
  - Reading progress automatically saved
  - Last opened book remembered
  - Theme and font preferences saved

## How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**: The app will open at `http://localhost:5173`

## How to Build for Production

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Preview the build**:
   ```bash
   npm run preview
   ```

## Deploy to GitHub Pages

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your GitHub Pages repository

3. **Configure base path** (if needed): The `vite.config.js` already includes `base: './'` for relative paths

## Usage

1. **Upload Books**: Click "Choose .txt files" to upload your text files
2. **Browse Library**: View all uploaded books in the bookshelf grid
3. **Read**: Click any book to open the reader
4. **Customize**: Adjust font size and theme using the controls
5. **Navigate**: Use "Back to Library" to return to the bookshelf

## Technical Details

- **Framework**: React 18 with Vite
- **Storage**: localStorage for persistence
- **Styling**: Custom CSS with responsive design
- **File Handling**: FileReader API for client-side file processing
- **No Backend Required**: Completely client-side application

## Browser Compatibility

Works in all modern browsers that support:
- FileReader API
- localStorage
- ES6+ features

## License

MIT License - feel free to use and modify as needed.