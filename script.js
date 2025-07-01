class FlashcardApp {
    constructor() {
        this.flashcards = [];
        this.currentCardIndex = 0;
        this.isFlipped = false;
        this.statistics = {
            total: 0,
            completed: 0,
            easy: 0,
            medium: 0,
            hard: 0
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromLocalStorage();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts if user is typing in input fields
            const activeElement = document.activeElement;
            const isInputField = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA' || 
                activeElement.contentEditable === 'true'
            );
            
            if (isInputField) return;
            
            // Only trigger shortcuts when flashcards are visible
            const flashcardsVisible = document.getElementById('flashcards-section').style.display !== 'none';
            if (!flashcardsVisible) return;
            
            if (e.key === 'ArrowLeft') this.previousCard();
            if (e.key === 'ArrowRight') this.nextCard();
            if (e.key === ' ') {
                e.preventDefault();
                this.flipCard();
            }
            if (e.key === '1') this.markCard(0); // Easy
            if (e.key === '2') this.markCard(1); // Medium
            if (e.key === '3') this.markCard(2); // Hard
        });

        // Auto-save to localStorage
        setInterval(() => {
            this.saveToLocalStorage();
        }, 30000); // Save every 30 seconds
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    async generateFromMarkdown() {
        const markdown = document.getElementById('markdown-input').value.trim();
        
        if (!markdown) {
            this.showNotification('Please enter some markdown content', 'error');
            return;
        }

        try {
            const btn = document.querySelector('#markdown-tab .generate-btn');
            this.setButtonLoading(btn, true);

            const cards = this.parseMarkdownToFlashcards(markdown);
            
            if (cards.length === 0) {
                this.showNotification('No flashcards could be generated. Make sure your markdown contains headers (# Question) followed by content.', 'warning');
                return;
            }

            this.flashcards = cards;
            this.currentCardIndex = 0;
            this.resetStatistics();
            this.displayFlashcards();
            this.showNotification(`Generated ${cards.length} flashcards successfully!`, 'success');

        } catch (error) {
            console.error('Error generating flashcards:', error);
            this.showNotification('Error generating flashcards. Please check your markdown format.', 'error');
        } finally {
            const btn = document.querySelector('#markdown-tab .generate-btn');
            this.setButtonLoading(btn, false);
        }
    }

    async generateFromUrl() {
        const url = document.getElementById('url-input').value.trim();
        
        if (!url) {
            this.showNotification('Please enter a URL', 'error');
            return;
        }

        if (!this.isValidUrl(url)) {
            this.showNotification('Please enter a valid URL', 'error');
            return;
        }

        try {
            const btn = document.querySelector('#url-tab .generate-btn');
            this.setButtonLoading(btn, true);

            // Try to fetch the content
            const content = await this.fetchUrlContent(url);
            const cards = this.parseTextToFlashcards(content);
            
            if (cards.length === 0) {
                this.showNotification('No flashcards could be generated from this URL. Try using markdown input instead.', 'warning');
                return;
            }

            this.flashcards = cards;
            this.currentCardIndex = 0;
            this.resetStatistics();
            this.displayFlashcards();
            this.showNotification(`Generated ${cards.length} flashcards from URL!`, 'success');

        } catch (error) {
            console.error('Error fetching URL:', error);
            this.showNotification('Error fetching URL. This might be due to CORS restrictions. Try using markdown input instead.', 'error');
        } finally {
            const btn = document.querySelector('#url-tab .generate-btn');
            this.setButtonLoading(btn, false);
        }
    }

    parseMarkdownToFlashcards(markdown) {
        const cards = [];
        const lines = markdown.split('\n');
        let currentQuestion = '';
        let currentAnswer = '';
        let inAnswer = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check if this is a header (question)
            if (line.match(/^#+\s+/)) {
                // Save previous card if exists
                if (currentQuestion && currentAnswer) {
                    cards.push({
                        question: currentQuestion.replace(/^#+\s+/, '').trim(),
                        answer: this.formatAnswer(currentAnswer.trim()),
                        difficulty: null,
                        id: Date.now() + Math.random()
                    });
                }
                
                // Start new card
                currentQuestion = line;
                currentAnswer = '';
                inAnswer = true;
            } else if (line && inAnswer) {
                // Add to current answer
                currentAnswer += line + '\n';
            }
        }

        // Don't forget the last card
        if (currentQuestion && currentAnswer) {
            cards.push({
                question: currentQuestion.replace(/^#+\s+/, '').trim(),
                answer: this.formatAnswer(currentAnswer.trim()),
                difficulty: null,
                id: Date.now() + Math.random()
            });
        }

        return cards;
    }

    parseTextToFlashcards(text) {
        // Simple text parsing - look for sentences that could be questions/answers
        const cards = [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
        
        for (let i = 0; i < sentences.length - 1; i += 2) {
            const question = sentences[i].trim();
            const answer = sentences[i + 1] ? sentences[i + 1].trim() : '';
            
            if (question && answer) {
                cards.push({
                    question: question + '?',
                    answer: this.formatAnswer(answer),
                    difficulty: null,
                    id: Date.now() + Math.random() + i
                });
            }
        }

        return cards.slice(0, 20); // Limit to 20 cards
    }

    formatAnswer(answer) {
        // Convert markdown to HTML if needed
        if (typeof marked !== 'undefined') {
            return marked.parse(answer);
        }
        return answer.replace(/\n/g, '<br>');
    }

    async fetchUrlContent(url) {
        // Note: This will likely fail due to CORS. In a real app, you'd need a backend proxy.
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch');
            const html = await response.text();
            
            // Extract text content from HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Remove script and style elements
            const scripts = doc.querySelectorAll('script, style');
            scripts.forEach(el => el.remove());
            
            return doc.body.textContent || doc.body.innerText || '';
        } catch (error) {
            throw new Error('Unable to fetch URL content. This might be due to CORS restrictions.');
        }
    }

    displayFlashcards() {
        if (this.flashcards.length === 0) return;

        document.getElementById('flashcards-section').style.display = 'block';
        document.getElementById('statistics').style.display = 'block';
        
        this.updateCard();
        this.updateNavigation();
        this.updateStatistics();
        this.updateProgress();
    }

    updateCard() {
        if (this.flashcards.length === 0) return;

        const card = this.flashcards[this.currentCardIndex];
        const flashcard = document.getElementById('current-flashcard');
        
        document.getElementById('question-content').innerHTML = card.question;
        document.getElementById('answer-content').innerHTML = card.answer;
        
        // Reset flip state
        flashcard.classList.remove('flipped');
        this.isFlipped = false;
        
        // Update flip button text
        const flipBtn = document.querySelector('.flip-btn');
        flipBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Show Answer';
    }

    flipCard() {
        const flashcard = document.getElementById('current-flashcard');
        const flipBtn = document.querySelector('.flip-btn');
        
        if (!this.isFlipped) {
            flashcard.classList.add('flipped');
            flipBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Show Question';
            this.isFlipped = true;
        } else {
            flashcard.classList.remove('flipped');
            flipBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Show Answer';
            this.isFlipped = false;
        }
    }

    nextCard() {
        if (this.currentCardIndex < this.flashcards.length - 1) {
            this.currentCardIndex++;
            this.updateCard();
            this.updateNavigation();
        }
    }

    previousCard() {
        if (this.currentCardIndex > 0) {
            this.currentCardIndex--;
            this.updateCard();
            this.updateNavigation();
        }
    }

    markCard(difficulty) {
        const card = this.flashcards[this.currentCardIndex];
        
        // Only count if not already marked
        if (card.difficulty === null) {
            this.statistics.completed++;
        }
        
        // Update difficulty
        card.difficulty = difficulty;
        
        // Update statistics
        this.statistics.easy = this.flashcards.filter(c => c.difficulty === 0).length;
        this.statistics.medium = this.flashcards.filter(c => c.difficulty === 1).length;
        this.statistics.hard = this.flashcards.filter(c => c.difficulty === 2).length;
        
        this.updateStatistics();
        this.updateProgress();
        
        // Auto-advance to next card
        setTimeout(() => {
            if (this.currentCardIndex < this.flashcards.length - 1) {
                this.nextCard();
            }
        }, 500);
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const counter = document.getElementById('card-counter');
        
        prevBtn.disabled = this.currentCardIndex === 0;
        nextBtn.disabled = this.currentCardIndex === this.flashcards.length - 1;
        
        counter.textContent = `${this.currentCardIndex + 1} / ${this.flashcards.length}`;
    }

    updateStatistics() {
        this.statistics.total = this.flashcards.length;
        
        document.getElementById('total-cards').textContent = this.statistics.total;
        document.getElementById('completed-cards').textContent = this.statistics.completed;
        document.getElementById('easy-cards').textContent = this.statistics.easy;
        document.getElementById('hard-cards').textContent = this.statistics.hard;
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        const percentage = this.flashcards.length > 0 ? (this.statistics.completed / this.flashcards.length) * 100 : 0;
        
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${this.statistics.completed} / ${this.flashcards.length}`;
    }

    shuffleCards() {
        this.flashcards = this.shuffleArray(this.flashcards);
        this.currentCardIndex = 0;
        this.updateCard();
        this.updateNavigation();
        this.showNotification('Cards shuffled!', 'success');
    }

    resetProgress() {
        this.flashcards.forEach(card => {
            card.difficulty = null;
        });
        this.resetStatistics();
        this.updateStatistics();
        this.updateProgress();
        this.showNotification('Progress reset!', 'success');
    }

    resetStatistics() {
        this.statistics = {
            total: this.flashcards.length,
            completed: 0,
            easy: 0,
            medium: 0,
            hard: 0
        };
    }

    exportCards() {
        if (this.flashcards.length === 0) {
            this.showNotification('No flashcards to export', 'warning');
            return;
        }

        const exportData = {
            flashcards: this.flashcards,
            statistics: this.statistics,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `flashcards-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Flashcards exported!', 'success');
    }

    // Utility functions
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<div class="loading"></div> Processing...';
        } else {
            button.disabled = false;
            // Restore original content based on which button it is
            if (button.closest('#markdown-tab')) {
                button.innerHTML = '<i class="fas fa-magic"></i> Generate Flashcards';
            } else {
                button.innerHTML = '<i class="fas fa-download"></i> Fetch & Generate';
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${message}
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            max-width: 400px;
            display: flex;
            align-items: center;
            gap: 10px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
            ${type === 'warning' ? 'color: #333;' : ''}
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    saveToLocalStorage() {
        const data = {
            flashcards: this.flashcards,
            currentCardIndex: this.currentCardIndex,
            statistics: this.statistics
        };
        localStorage.setItem('flashcardApp', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('flashcardApp');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                if (parsed.flashcards && parsed.flashcards.length > 0) {
                    this.flashcards = parsed.flashcards;
                    this.currentCardIndex = parsed.currentCardIndex || 0;
                    this.statistics = parsed.statistics || this.statistics;
                    this.displayFlashcards();
                }
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            }
        }
    }
}

// Global functions for HTML onclick handlers
let app;

function generateFromMarkdown() {
    app.generateFromMarkdown();
}

function generateFromUrl() {
    app.generateFromUrl();
}

function flipCard() {
    app.flipCard();
}

function nextCard() {
    app.nextCard();
}

function previousCard() {
    app.previousCard();
}

function markCard(difficulty) {
    app.markCard(difficulty);
}

function shuffleCards() {
    app.shuffleCards();
}

function resetProgress() {
    app.resetProgress();
}

function exportCards() {
    app.exportCards();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app = new FlashcardApp();
});
