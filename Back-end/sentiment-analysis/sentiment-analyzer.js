import aposToLexForm from 'apos-to-lex-form';
import stopword from 'stopword';
import { lemmatizer } from 'lemmatizer';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const words = require('./words.json');

export const analyzeSentiment = (text) => {
    const lexText = aposToLexForm(text);
    const lowerLexText = lexText.toLowerCase();
    const cleanText = lowerLexText.replace(/[^a-zA-Z\s]+/g, '');
    const textTokens = tokenizeText(cleanText);
    const filteredText = stopword.removeStopwords(textTokens);

    let positiveWordCount = 0;
    let negativeWordCount = 0;

    for (let index in filteredText){
        const lemmaWord = lemmatizer(filteredText[index]);
        
        let modifier = 0;
        if (index > 0 && words.enhencers.includes(filteredText[index-1])){
            modifier++;
        } else if (index > 0 && words.negators.includes(filteredText[index-1])){
            modifier--;
        }

        if (words.positives.includes(lemmaWord)){
            positiveWordCount++;
            positiveWordCount += modifier;
        }else if (words.negatives.includes(lemmaWord)){
            negativeWordCount++;
            negativeWordCount -= modifier;
        }
    }

    const sentiment = (positiveWordCount / filteredText.length) - (negativeWordCount / filteredText.length);

    if ( sentiment < 0){
        return 'negative';
    }
    else if (sentiment === 0){
        return 'neutral';
    }

    return 'positive';
}

const tokenizeText = (text) => {
    
    return text.split(' ');
}
