const { JSDOM } = require('jsdom');
const BookSearchModule = require('../public/scripts/search');

describe('BookSearchModule', () => {
    let documentMock;

    beforeEach(() => {
        documentMock = new JSDOM(`
            <!DOCTYPE html>
            <html>
                <body>
                    <input id="search-input" />
                    <ul id="suggestions-list"></ul>
                </body>
            </html>
        `);
        global.document = documentMock.window.document;
        global.window = documentMock.window;
    });

    afterEach(() => {
        delete global.document;
        delete global.window;
    });

    it('should initialize and attach event listeners to search input', () => {
        const searchInput = document.getElementById('search-input');
        spyOn(searchInput, 'addEventListener');

        BookSearchModule.init();

        expect(searchInput.addEventListener).toHaveBeenCalledWith('input', jasmine.any(Function));
        expect(searchInput.addEventListener).toHaveBeenCalledWith('keydown', jasmine.any(Function));
    });

    it('should handle Enter keypress and navigate to results page', () => {
        const searchInput = document.getElementById('search-input');
        searchInput.value = 'test';

        const mockLocation = { assign: jasmine.createSpy('assign') };
        Object.defineProperty(global, 'window', {
            value: { location: mockLocation },
            writable: true,
        });

        const event = new global.document.defaultView.KeyboardEvent('keydown', {
            key: 'Enter',
        });
        Object.defineProperty(event, 'target', { writable: false, value: searchInput });

        BookSearchModule.handleEnterPress(event);

        expect(mockLocation.assign).toHaveBeenCalledWith('results.html?q=test');
    });

    it('should clear suggestions if input is empty', async () => {
        const searchInput = document.getElementById('search-input');
        searchInput.value = ''; // Simulate empty input

        spyOn(BookSearchModule, 'clearSuggestions').and.callThrough();

        // Call searchBooks
        await BookSearchModule.searchBooks();

        // Verify that clearSuggestions was called
        expect(BookSearchModule.clearSuggestions).toHaveBeenCalled();
    });

    it('should fetch and display book suggestions for valid queries', async () => {
        const searchInput = document.getElementById('search-input');
        searchInput.value = 'harry';

        const mockResponse = {
            json: () => Promise.resolve({ items: [{ volumeInfo: { title: 'Harry Potter' } }] }),
        };
        spyOn(global, 'fetch').and.returnValue(Promise.resolve(mockResponse));

        const suggestionsList = document.getElementById('suggestions-list');
        await BookSearchModule.searchBooks();

        expect(global.fetch).toHaveBeenCalledWith(
            jasmine.stringMatching('https://www.googleapis.com/books/v1/volumes')
        );
        expect(suggestionsList.childElementCount).toBe(1);
        expect(suggestionsList.firstChild.textContent).toBe('Harry Potter');
    });

    it('should clear suggestions list', () => {
        const suggestionsList = document.getElementById('suggestions-list');
        suggestionsList.innerHTML = '<li>Suggestion</li>';

        BookSearchModule.clearSuggestions();

        expect(suggestionsList.childElementCount).toBe(0);
    });

    it('should populate suggestions list with book titles', () => {
        const suggestionsList = document.getElementById('suggestions-list');
        const books = [
            { volumeInfo: { title: 'Book 1' } },
            { volumeInfo: { title: 'Book 2' } },
        ];

        BookSearchModule.displaySuggestions(books);

        expect(suggestionsList.childElementCount).toBe(2);
        expect(suggestionsList.firstChild.textContent).toBe('Book 1');
    });
});
