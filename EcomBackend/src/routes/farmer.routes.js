import express from 'express';
import RSSParser from 'rss-parser';

const router = express.Router();
const rssParser = new RSSParser();

// Agriculture News Scraper Class
class AgricultureNewsScraper {
    constructor() {
        this.newsSources = [
            {
                name: 'Google News',
                queries: [
                    'agriculture farming news',
                    'government agricultural schemes',
                    'fertilizer sector updates',
                    'crop production news',
                    'agricultural policy changes'
                ]
            }
        ];
    }
    async fetchFertilizerInformation() {
        const fertilizers = [];

        // Scrape fertilizer information from multiple sources
        try {
            // Fertilizer prices from a sample agricultural portal (replace with actual URLs)
            const pricesResponse = await this.axios.get('https://agricoop.nic.in/en/fertilizer-prices');
            const $prices = this.cheerio.load(pricesResponse.data);
            
            $prices('.fertilizer-table tr').each((index, element) => {
                const name = $prices(element).find('td:nth-child(1)').text().trim();
                const price = $prices(element).find('td:nth-child(2)').text().trim();
                
                if (name && price) {
                    fertilizers.push({
                        title: `Fertilizer Price: ${name}`,
                        description: `Current price: ${price}`,
                        type: 'fertilizer-price',
                        source: 'Agricultural Cooperative'
                    });
                }
            });

            // Scrape usage guidelines
            const guidelinesResponse = await this.axios.get('https://agricoop.nic.in/en/fertilizer-usage-guidelines');
            const $guidelines = this.cheerio.load(guidelinesResponse.data);
            
            $guidelines('.guideline-list li').each((index, element) => {
                const guideline = $guidelines(element).text().trim();
                
                if (guideline) {
                    fertilizers.push({
                        title: 'Fertilizer Usage Guideline',
                        description: guideline,
                        type: 'fertilizer-guideline',
                        source: 'Agricultural Cooperative'
                    });
                }
            });

        } catch (error) {
            console.error('Error fetching fertilizer information:', error);
        }

        return fertilizers;
    }
    async fetchGoogleNews(query) {
        try {
            const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;
            const feed = await rssParser.parseURL(rssUrl);

            const newsItems = feed.items.slice(0, 10).map(item => ({
                title: item.title,
                link: item.link,
                description: item.contentSnippet,
                published_date: item.pubDate,
                source: item.source ? item.source.title : 'Google News'
            }));

            return newsItems;
        } catch (error) {
            console.error(`Error fetching Google News for ${query}: ${error}`);
            return [];
        }
    }

    async fetchGovernmentSchemes() {
        // Placeholder for government schemes (you can replace this with an actual API call or web scraping)
        return [
            {
                title: 'PM-KISAN Scheme',
                description: 'Direct income support to farmer families',
                link: 'https://pmkisan.gov.in/',
                type: 'scheme'
            },
            {
                title: 'Pradhan Mantri Fasal Bima Yojana',
                description: 'Crop insurance scheme for farmers',
                link: 'https://pmfby.gov.in/',
                type: 'scheme'
            }
        ];
    }

    async fetchFertilizerUsageBlogs() {
        // Placeholder for fertilizer usage blogs (replace with actual blogs fetching mechanism)
        return [
            {
                title: 'Best Practices for Fertilizer Usage',
                description: 'Learn how to use fertilizers efficiently to increase crop yield.',
                link: 'https://example.com/fertilizer-usage-best-practices',
                type: 'blog'
            },
            {
                title: 'Understanding Fertilizer Types',
                description: 'A guide to different types of fertilizers and how they affect soil.',
                link: 'https://example.com/understanding-fertilizer-types',
                type: 'blog'
            }
        ];
    }

    async aggregateNews() {
        const allNews = [];
        for (const source of this.newsSources) {
            if (source.queries) {
                for (const query of source.queries) {
                    const news = await this.fetchGoogleNews(query);
                    allNews.push(...news);
                }
            }
        }

        // Fetch additional data like schemes, blogs, and now fertilizer information
        const schemes = await this.fetchGovernmentSchemes();
        const fertilizerBlogs = await this.fetchFertilizerUsageBlogs();
        const fertilizerInfo = await this.fetchFertilizerInformation();

        // Combine all data sources
        const combinedData = [...allNews, ...schemes, ...fertilizerBlogs, ...fertilizerInfo];

        // Remove duplicates and sort news
        const uniqueNews = [];
        const seenTitles = new Set();
        for (const item of combinedData) {
            if (!seenTitles.has(item.title)) {
                seenTitles.add(item.title);
                uniqueNews.push(item);
            }
        }

        uniqueNews.sort((a, b) => {
            // Handle sorting for items that might not have published_date
            const dateA = new Date(b.published_date || Date.now());
            const dateB = new Date(a.published_date || Date.now());
            return dateA - dateB;
        });

        return uniqueNews.slice(0, 20); // Limit to 20 items
    }
}

// Define the route to fetch agricultural news and related info
router.get('/news', async (req, res) => {
    const scraper = new AgricultureNewsScraper();
    try {
        const newsItems = await scraper.aggregateNews();
        res.json(newsItems); // Send the response as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching agricultural news and related content' });
    }
});

export default router;
