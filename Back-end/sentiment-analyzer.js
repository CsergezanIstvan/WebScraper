import natural from 'natural';
import aposToLexForm from 'apos-to-lex-form';
import stopword from 'stopword';
const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = natural;

export const analyzeSentiment = (text) => {
    const lexText = aposToLexForm(text);
    const lowerLexText = lexText.toLowerCase();
    const cleanText = lowerLexText.replace(/[^a-zA-Z\s]+/g, '');
    const textTokens = tokenizeText(cleanText);
    const filteredText = stopword.removeStopwords(textTokens);

    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const sentiment = analyzer.getSentiment(filteredText);

    if ( sentiment < 0){
        return 'negative';
    }
    else if (sentiment === 0){
        return 'neutral';
    }

    return 'positive';

}

const tokenizeText = (text) => {
    const tokenizer = new WordTokenizer();
    
    return tokenizer.tokenize(text);
}
