import sys
from collections import Counter

def get_word_rank(word):
    """
    Determines the rank and tie-breaking value of a word based on the revised rules.
    """
    counts = Counter(word)

    # 1. Quintessential (Rank 5)
    quint_letters = [letter for letter, count in counts.items() if count >= 5]
    if quint_letters:
        return (5, max(quint_letters))

    # 2. Trio (New Rank: 4)
    # A word with at least one letter appearing 3 times. Tie-breaker is the most valuable trio letter.
    trio_letters = [letter for letter, count in counts.items() if count == 3]
    if trio_letters:
        return (4, max(trio_letters))

    # 3. Duo (New Rank: 3)
    # A word with at least one letter appearing 2 times. Tie-breaker is the most valuable pair letter.
    duo_letters = [letter for letter, count in counts.items() if count == 2]
    if duo_letters:
        return (3, max(duo_letters))

    # 4. Palindrome (New Rank: 2)
    if len(word) >= 3 and word == word[::-1]:
        return (2, (len(word), word))

    # 5. Ordered (New Rank: 1)
    if list(word) == sorted(word):
        return (1, (len(word), max(word)))

    # 6. Standard (Rank 0)
    return (0, word)

def compare_words(word1, word2):
    """
    Compares two words and determines the winner.
    """
    rank1, tie_breaker1 = get_word_rank(word1)
    rank2, tie_breaker2 = get_word_rank(word2)

    if rank1 > rank2:
        return "Black wins."
    elif rank2 > rank1:
        return "White wins."
    else:  # Same category, apply tie-breaking rules
        if tie_breaker1 > tie_breaker2:
            return "Black wins."
        elif tie_breaker2 > tie_breaker1:
            return "White wins."
        else:
            return "Tie."

def main():
    """
    Reads pairs of words from standard input and prints the winner of each duel.
    """
    for line in sys.stdin:
        parts = line.strip().split()
        if len(parts) == 2:
            black_word, white_word = parts
            result = compare_words(black_word, white_word)
            print(result)

if __name__ == "__main__":
    main()