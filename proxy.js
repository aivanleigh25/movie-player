const cheerio = require('cheerio');
const fetch = require('node-fetch');

// uBlock Origin Lite filter lists
const FILTER_LIST_URLS = [
  'https://easylist.to/easylist/easylist.txt',
  'https://easylist.to/easylist/easyprivacy.txt',
  'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=adblockplus&showintro=1&mimetype=plaintext',
  'https://ublockorigin.github.io/uAssets/filters/filters.txt',
];

let adblockRules = [];

// Load filter rules at startup
async function loadFilterRules() {
  const promises = FILTER_LIST_URLS.map(url => fetch(url).then(res => res.text()));
  const responses = await Promise.all(promises);
  adblockRules = responses.flatMap(text => text.split('\n').filter(line => line.trim() && !line.startsWith('!'))); // Filter out comments
}

loadFilterRules().catch(console.error);

// Simple rule matcher
function shouldBlock(url) {
  return adblockRules.some(rule => {
    if (rule.startsWith('||')) return url.includes(rule.slice(2).replace(/^[^/]+/, ''));
    if (rule.startsWith('|')) return url.startsWith(rule.slice(1));
    if (rule.includes('*')) return new RegExp(rule.replace('*', '.*')).test(url);
    return url.includes(rule);
  });
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { url } = event.queryStringParameters;
  if (!url) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No URL provided' }) };
  }

  const allowedDomains = ['vidsrc.me', 'vidsrc.to', '2embed.cc', 'vid-src-embeds-no-ads-demo.vercel.app'];
  if (!allowedDomains.some(domain => url.includes(domain))) {
    return { statusCode: 403, body: JSON.stringify({ error: 'Invalid domain' }) };
  }

  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const htmlContent = await response.text();

    const $ = cheerio.load(htmlContent);

    // Remove ad-related elements
    ['script', 'img', 'iframe', 'link', 'source', 'object', 'embed'].forEach(tag => {
      $(tag).each((i, el) => {
        const src = $(el).attr('src') || $(el).attr('href') || $(el).attr('data');
        if (src && shouldBlock(src)) $(el).remove();
      });
    });

    // Fallback for inline scripts with ad patterns
    const adPatterns = ['ads', 'doubleclick', 'googlesyndication', 'adserver'];
    $('script').each((i, el) => {
      const content = $(el).html().toLowerCase();
      if (adPatterns.some(pattern => content.includes(pattern)) || shouldBlock($(el).attr('src') || '')) {
        $(el).remove();
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: $.html(),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: `Error fetching URL: ${error.message}` }) };
  }
};    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { url } = event.queryStringParameters;
  if (!url) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No URL provided' }) };
  }

  const allowedDomains = ['vidsrc.me', 'vidsrc.to', '2embed.cc', 'vid-src-embeds-no-ads-demo.vercel.app'];
  if (!allowedDomains.some(domain => url.includes(domain))) {
    return { statusCode: 403, body: JSON.stringify({ error: 'Invalid domain' }) };
  }

  try {
    // Fetch the content (using Selenium for dynamic content if needed, otherwise fetch)
    let htmlContent;
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();
    await driver.get(url);
    htmlContent = await driver.getPageSource();
    await driver.quit();

    const $ = cheerio.load(htmlContent);

    // Remove ad-related elements
    ['script', 'img', 'iframe', 'link', 'source', 'object', 'embed'].forEach(tag => {
      $(tag).each((i, el) => {
        const src = $(el).attr('src') || $(el).attr('href') || $(el).attr('data');
        if (src && shouldBlock(src)) $(el).remove();
      });
    });

    // Fallback for inline scripts with ad patterns
    const adPatterns = ['ads', 'doubleclick', 'googlesyndication', 'adserver'];
    $('script').each((i, el) => {
      const content = $(el).html().toLowerCase();
      if (adPatterns.some(pattern => content.includes(pattern)) || shouldBlock($(el).attr('src') || '')) {
        $(el).remove();
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: $.html(),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: `Error fetching URL: ${error.message}` }) };
  }
};
