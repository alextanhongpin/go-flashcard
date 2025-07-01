# Flashcard Generator

A beautiful, modern web application that converts markdown content or website links into interactive flashcards for effective studying.

## Features

- **Markdown to Flashcards**: Convert markdown content with headers into question-answer flashcards
- **🤖 AI-Powered Generation**: Intelligent content analysis to automatically create diverse question types
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
   - **🤖 AI Generate Tab**: Enter any text content for intelligent question generation
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

## AI Generation Example

```text
JavaScript is a programming language that enables interactive web pages and is an essential part of web applications. It was originally developed by Brendan Eich at Netscape in 1995. JavaScript can be used for both client-side and server-side development. Modern frameworks like React, Angular, and Vue.js are built on JavaScript.

→ AI will automatically generate questions like:
- "What is JavaScript?"
- "Who developed JavaScript and when?"
- "Give an example of JavaScript frameworks"
- "Fill in the blank: JavaScript enables _____ web pages"
```

## Keyboard Shortcuts

- **Space**: Flip current flashcard
- **Left Arrow**: Previous card
- **Right Arrow**: Next card  
- **1**: Mark as Easy
- **2**: Mark as Medium
- **3**: Mark as Hard

## Features in Detail

### 🤖 AI-Powered Question Generation
- **Smart Content Analysis**: Automatically identifies key concepts, definitions, and relationships
- **Multiple Question Types**:
  - **Definition Questions**: "What is X?" based on important terms
  - **Explanation Questions**: "Why/How?" questions from cause-effect relationships  
  - **Example Questions**: "Give an example of..." from illustrative content
  - **Fill-in-the-Blank**: Interactive completion questions for active recall
- **Customizable Options**: Choose question types and number of cards (5-20)
- **Intelligent Processing**: Works with any text content - articles, notes, documentation

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

## AI Generation Capabilities

### Smart Text Analysis
The AI system analyzes your content using advanced natural language processing techniques:

- **🔍 Key Term Extraction**: Identifies important concepts using frequency analysis and context
- **📊 Relationship Detection**: Finds cause-effect, definition, and example relationships
- **🎯 Question Type Classification**: Automatically determines the best question format for each concept
- **🧠 Context-Aware Processing**: Maintains semantic meaning when creating questions

### Question Generation Algorithms
- **Definition Detection**: Scans for explanatory content and creates "What is..." questions
- **Causal Analysis**: Identifies "because", "therefore", "due to" patterns for explanation questions  
- **Example Recognition**: Finds "such as", "including", "like" patterns for example questions
- **Fill-in-the-Blank Creation**: Strategically removes key terms for active recall testing

### Learning Science Integration
- **Spaced Repetition Ready**: Cards are formatted for optimal spaced repetition algorithms
- **Difficulty Gradation**: Automatically varies question complexity based on content depth  
- **Active Recall Focus**: Emphasizes question formats that promote active memory retrieval
- **Interleaving Support**: Generates diverse question types to prevent pattern recognition

## Browser Compatibility

Works in all modern browsers including:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Notes

- **AI Generation**: Uses advanced text analysis for intelligent question creation - no external API required
- URL fetching may be limited by CORS policies - use markdown or AI input for best results
- Data is stored locally in your browser
- No server required - runs completely client-side
- AI processing works entirely offline in your browser

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
