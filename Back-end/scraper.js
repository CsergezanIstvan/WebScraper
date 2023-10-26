import puppeteer from 'puppeteer';
import { analyzeSentiment } from './sentiment-analyzer.js';

const getDate = (imageElement) => {
    const aElement = imageElement.parentNode;
    const postDiv = aElement.parentNode;
    const childDiv = postDiv.children[1];
    const secondChildDiv = childDiv.children[0];
    const time = secondChildDiv.children[0];

    const date = time.textContent.trim();

    return date;
}

const getImageAlt = (imageElement) => {

    return imageElement.alt;
}

const getTitle = (imageElement) => {
    const aElement = imageElement.parentNode;
    const postDiv = aElement.parentNode;
    const childDiv = postDiv.children[1];
    const secondChild = childDiv.children[1];
    const titleDiv = secondChild.children[0];
    const titleHref = titleDiv.firstChild;

    const title = titleHref.textContent.trim();

    return title;
}

const getHref = (imageElement) => {
    const aElement = imageElement.parentNode;

    return aElement.href;
}

const getShortDescription = (imageElement) => {
    const aElement = imageElement.parentNode;
    const postDiv = aElement.parentNode;
    const childDiv = postDiv.children[1];
    const secondChild = childDiv.children[1];
    const descriptionDiv = secondChild.children[1];

    const shortDescription = descriptionDiv.textContent.trim();

    return shortDescription;
}

const getLongDescription = () => {
    const longDescription = document.body
        .childNodes[0]
        .children[0]
        .children[0]
        .children[0]
        .children[1]
        .children[0]
        .children[2]
        .children[1]
    .textContent.trim();

    return longDescription;
}

const getPostText = () => {

    return document.body.childNodes[0].textContent;
}

const getPostData = async (browser, postUrl) => {
    const postPage = await browser.newPage();

    await postPage.goto(postUrl, {
        waitUntil: "domcontentloaded"
    });

    const body = await postPage.$$('body');

    const longDescription = await postPage.evaluate(getLongDescription);
    const text = await postPage.evaluate(getPostText);

    const data = {
        longDescription: longDescription,
        wordCount: text.split(' ').length,
        fullText: text
    }

    return data;
}

const imageSource = (imageElement) => {

    return imageElement.src;
}

export const scrapeWebsite = async (url) => {
    const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
});

const page = await browser.newPage();

await page.goto(url, {
    waitUntil: "domcontentloaded",
});

const imageElementList = await page.$$('img');

const data = [];

for (let i = 0; i < imageElementList.length; i++){
    const imageElement = imageElementList[i];
    const imageAlt = await page.evaluate(getImageAlt, imageElement);
    if (imageAlt === 'post.author.name'){
        continue;
    }
    const date = await page.evaluate(getDate, imageElement);
    const image = await page.evaluate(imageSource, imageElement);
    const title = await page.evaluate(getTitle, imageElement);
    const shortDescription = await page.evaluate(getShortDescription, imageElement);
    const href = await page.evaluate(getHref, imageElement);
    const postData = await getPostData(browser, new URL(href, url));
    const sentiment = analyzeSentiment(postData.fullText);

    data.push(
        { 
            title: title,
            short_description: shortDescription,
            image: image,
            href: href,
            date: date,
            long_description: postData.longDescription,
            word_count: postData.wordCount,
            sentiment: sentiment
        });
}

await browser.close();

return data;

};