const axios = require('axios');
const { JSDOM } = require('jsdom');

async function scrapeWithCookie(url, cookie) {
  try {
    // Fetch the HTML of the authenticated page using the provided cookie
    const response = await axios.get(url, {
      headers: {
        Cookie: cookie
      }
    });

    // Load the HTML into jsdom
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Extract all the links
    const links = [];
    const anchorTags = document.querySelectorAll('a');

    anchorTags.forEach(anchor => {
      const link = anchor.href;
      if (link) {
        links.push(link);
      }
    });

    // Return the list of links
    return links;
  } catch (error) {
    console.error(`Error scraping with provided cookie from ${url}:`, error);
    return [];
  }
}

// Example usage
const url = 'https://example.com/dashboard'; // Replace with the authenticated URL
const cookie = 'your_cookie_here'; // Replace with your provided cookie

scrapeWithCookie(url, cookie).then(links => {
  console.log('Links found on the authenticated page:', links);
});

