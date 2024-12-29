// const { stopwords } = require('natural');
import natural from "natural";

/**
 * Compute the Damerau-Levenshtein distance between two strings.
 * @param {string} a - The first string.
 * @param {string} b - The second string.
 * @returns {number} - The Damerau-Levenshtein distance.
 */
function damerauLevenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;

    let prevRow = Array(n + 1).fill(0);
    let currRow = Array(n + 1).fill(0);

    for (let j = 0; j <= n; j++) prevRow[j] = j;

    for (let i = 1; i <= m; i++) {
        currRow[0] = i;
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            currRow[j] = Math.min(
                currRow[j - 1] + 1,  // Insertion
                prevRow[j] + 1,      // Deletion
                prevRow[j - 1] + cost  // Substitution
            );

            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                currRow[j] = Math.min(currRow[j], prevRow[j - 2] + 1);  // Transposition
            }
        }
        [prevRow, currRow] = [currRow, prevRow];  // Swap rows
    }
    return prevRow[n];
}

/**
 * Find the most similar word from a dictionary based on Damerau-Levenshtein distance.
 * @param {string} target - The target word to compare against.
 * @param {string[]} dictionary - Array of words in the dictionary.
 * @returns {string} - The most similar word from the dictionary.
 */
function findMostSimilarWord(target, dictionary) {
    if (dictionary.length === 0) return null;

    let mostSimilarWord = dictionary[0];
    let smallestDistance = damerauLevenshtein(target, dictionary[0]);

    for (const word of dictionary) {
        const distance = damerauLevenshtein(target, word);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            mostSimilarWord = word;
        }
    }

    return mostSimilarWord;
}

/**
 * Correcting the spelling errors in the sentence
 * @param {string} sentence
 * @param {string[]} dictionary
 */
function correctSpellings(sentence, dictionary) {
    sentence = sentence.replace(/[^\w\s]/gi, '');
    let words = sentence.split(" ");
    words = words.filter(word => !natural.stopwords.includes(word.toLowerCase()));
    const correctedSentence = words.map((word) => findMostSimilarWord(word.toLowerCase(), dictionary));
    return correctedSentence.join(" ")
}

export default correctSpellings;