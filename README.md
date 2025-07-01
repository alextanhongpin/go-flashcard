# Flashcard Generator

A beautiful, modern web application that converts markdown content or website links into interactive flashcards for effective studying.

## Features

- **Markdown to Flashcards**: Convert markdown content with headers into question-answer flashcards
- **URL Content Processing**: Fetch content from websites and generate flashcards (limited by CORS)
- **Interactive Flashcards**: Flip cards to reveal answers with smooth animations  
- **Study Progress Tracking**: Track your progress with difficulty ratings (Easy, Medium, Hard)
- **Statistics Dashboard**: View study statistics and progress
- **Keyboard Shortcuts**: Navigate with arrow keys, flip with spacebar, rate with number keys
- **Export Functionality**: Export your flashcards as JSON for backup
- **Auto-save**: Automatically saves progress to localStorage
- **Responsive Design**: Works perfectly on desktop and mobile devices

## How to Use

1. **Open `index.html`** in your web browser
2. **Choose Input Method**:
   - **Markdown Tab**: Paste markdown content with headers (# Question) followed by answers
   - **URL Tab**: Enter a website URL to extract content (may be limited by CORS policies)
3. **Click "Generate Flashcards"** to create your study set
4. **Study**: Flip cards to see answers and rate difficulty
5. **Track Progress**: Monitor your statistics and progress bar

## Markdown Format Example

```markdown
# What is JavaScript?
JavaScript is a programming language used for web development and creating interactive websites.

# What does HTML stand for?
HTML stands for HyperText Markup Language and is used to structure web content.

# Purpose of CSS
CSS (Cascading Style Sheets) is used to style and layout web pages, controlling appearance and formatting.
```

## Keyboard Shortcuts

- **Space**: Flip current flashcard
- **Left Arrow**: Previous card
- **Right Arrow**: Next card  
- **1**: Mark as Easy
- **2**: Mark as Medium
- **3**: Mark as Hard

## Features in Detail

### Study Modes
- **Sequential Study**: Study cards in order
- **Shuffle Mode**: Randomize card order for better retention
- **Progress Tracking**: Visual progress bar and completion statistics

### Data Management
- **Auto-save**: Progress automatically saved to browser storage
- **Export**: Download flashcards as JSON file
- **Reset**: Clear all progress and start fresh

### Statistics
- Total cards created
- Cards completed  
- Difficulty distribution
- Study progress tracking

## Browser Compatibility

Works in all modern browsers including:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Notes

- URL fetching may be limited by CORS policies - use markdown input for best results
- Data is stored locally in your browser
- No server required - runs completely client-side

## File Structure

```
/
├── index.html          # Main application file
├── styles.css          # Styling and responsive design
├── script.js          # Application logic and functionality
└── README.md          # This file
```

## Getting Started

Simply open `index.html` in your web browser and start creating flashcards!
