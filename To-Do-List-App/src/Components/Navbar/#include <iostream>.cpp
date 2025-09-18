#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <map>

// Categories are ranked from highest (0) to lowest (5).
enum class Category {
    QUINTESSENTIAL,
    PALINDROME,
    ORDERED,
    TRIO,
    DUO,
    STANDARD
};

// A structure to hold the analysis results for a word.
struct WordAnalysis {
    std::string originalWord;
    Category category;
    char tieBreakerChar = '\0'; // Used for Quintessential, Trio, and Duo categories.
};

// ## Word Analysis Function
// This function takes a word and determines its category and tie-breaking value.
WordAnalysis analyzeWord(const std::string& word) {
    WordAnalysis result;
    result.originalWord = word;
    std::map<char, int> counts;
    for (char c : word) {
        counts[c]++;
    }

    // 1. Check for Quintessential: Five or more identical letters.
    char quintessentialChar = '\0';
    for (const auto& pair : counts) {
        if (pair.second >= 5) {
            // In case of multiple groups (e.g., AAAAABBBBB), the more valuable letter wins.
            quintessentialChar = std::max(quintessentialChar, pair.first);
        }
    }
    if (quintessentialChar != '\0') {
        result.category = Category::QUINTESSENTIAL;
        result.tieBreakerChar = quintessentialChar;
        return result;
    }

    // 2. Check for Palindrome: Reads the same forwards and backwards (length >= 3).
    if (word.length() >= 3) {
        std::string reversed_word = word;
        std::reverse(reversed_word.begin(), reversed_word.end());
        if (word == reversed_word) {
            result.category = Category::PALINDROME;
            return result;
        }
    }

    // 3. Check for Ordered: Letters are in non-decreasing alphabetical order.
    bool is_ordered = true;
    for (size_t i = 1; i < word.length(); ++i) {
        if (word[i] < word[i - 1]) {
            is_ordered = false;
            break;
        }
    }
    if (is_ordered) {
        result.category = Category::ORDERED;
        return result;
    }

    // 4. Check for Trio and Duo
    // Trio: Exactly one letter appears 3 times, all others appear once.
    // Duo: Exactly one letter appears 2 times, all others appear once.
    char trioChar = '\0';
    char duoChar = '\0';
    bool is_clean_of_other_pairs = true;

    for (const auto& pair : counts) {
        if (pair.second == 3) {
            if (trioChar != '\0') { is_clean_of_other_pairs = false; break; }
            trioChar = pair.first;
        } else if (pair.second == 2) {
            if (duoChar != '\0') { is_clean_of_other_pairs = false; break; }
            duoChar = pair.first;
        } else if (pair.second != 1) { // Any other count (e.g., 4) invalidates Trio/Duo
            is_clean_of_other_pairs = false;
            break;
        }
    }
    
    if (is_clean_of_other_pairs) {
        // A valid Trio cannot have any pairs.
        if (trioChar != '\0' && duoChar == '\0') {
            result.category = Category::TRIO;
            result.tieBreakerChar = trioChar;
            return result;
        }
        // A valid Duo cannot have any trios.
        if (duoChar != '\0' && trioChar == '\0') {
            result.category = Category::DUO;
            result.tieBreakerChar = duoChar;
            return result;
        }
    }

    // 5. Standard: The default category if no other rules match.
    result.category = Category::STANDARD;
    return result;
}

// ## Main Program Logic
int main() {
    // Fast I/O
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);

    std::string black_word, white_word;

    // Process pairs of words until end-of-file.
    while (std::cin >> black_word >> white_word) {
        WordAnalysis black = analyzeWord(black_word);
        WordAnalysis white = analyzeWord(white_word);

        // First, compare by category rank.
        if (black.category < white.category) {
            std::cout << "Black wins.\n";
            continue;
        }
        if (white.category < black.category) {
            std::cout << "White wins.\n";
            continue;
        }

        // --- If categories are the same, apply tie-breaking rules ---
        switch (black.category) {
            case Category::QUINTESSENTIAL:
            case Category::TRIO:
            case Category::DUO:
                if (black.tieBreakerChar > white.tieBreakerChar) {
                    std::cout << "Black wins.\n";
                } else if (white.tieBreakerChar > black.tieBreakerChar) {
                    std::cout << "White wins.\n";
                } else {
                    std::cout << "Tie.\n";
                }
                break;

            case Category::PALINDROME:
                if (black.originalWord.length() > white.originalWord.length()) {
                    std::cout << "Black wins.\n";
                } else if (white.originalWord.length() > black.originalWord.length()) {
                    std::cout << "White wins.\n";
                } else { // Same length, compare alphabetically.
                    if (black.originalWord > white.originalWord) {
                        std::cout << "Black wins.\n";
                    } else if (white.originalWord > black.originalWord) {
                        std::cout << "White wins.\n";
                    } else {
                        std::cout << "Tie.\n";
                    }
                }
                break;

            case Category::ORDERED:
                if (black.originalWord.length() > white.originalWord.length()) {
                    std::cout << "Black wins.\n";
                } else if (white.originalWord.length() > white.originalWord.length()) {
                    std::cout << "White wins.\n";
                } else { // Same length, compare most valuable (last) letter.
                    if (black.originalWord.back() > white.originalWord.back()) {
                        std::cout << "Black wins.\n";
                    } else if (white.originalWord.back() > black.originalWord.back()) {
                        std::cout << "White wins.\n";
                    } else {
                        std::cout << "Tie.\n";
                    }
                }
                break;

            case Category::STANDARD:
                if (black.originalWord > white.originalWord) {
                    std::cout << "Black wins.\n";
                } else if (white.originalWord > black.originalWord) {
                    std::cout << "White wins.\n";
                } else {
                    std::cout << "Tie.\n";
                }
                break;
        }
    }

    return 0;
}