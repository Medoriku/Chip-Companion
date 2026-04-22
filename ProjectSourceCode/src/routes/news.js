const express = require("express");
const router = express.Router();
const Parser = require("rss-parser");

const parser = new Parser();

router.get("/", async (req, res) => {
  try {
    const rssUrl = "https://www.cardplayer.com/poker-news.rss";

    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8"
      }
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();

    const feed = await parser.parseString(xml);

    const articles = (feed.items || []).map((item) => ({
      title: item.title || "",
      summary: item.contentSnippet || item.content || item.summary || "",
      url: item.link || "",
      publishedAt: item.pubDate || ""
    }));

    res.json(articles);
  } catch (err) {
    //console.error("News fetch error:", err);
    //res.status(500).json({
      //error: "Failed to fetch news",
      //details: err.message
    
    //});

    console.error("News fetch error:", err);

    // 🔥 Fallback data for demo
    const fallback = [
      {
        title: "WSOP 2026 Main Event Updates",
        summary: "Latest updates from the poker world.",
        url: "https://www.cardplayer.com",
        publishedAt: new Date().toISOString()
      },
      {
        title: "High Stakes Poker Returns",
        summary: "Top players compete in new season.",
        url: "https://www.cardplayer.com",
        publishedAt: new Date().toISOString()
      },
      {
        title: "Online Poker Trends in 2026",
        summary: "How the industry is evolving.",
        url: "https://www.cardplayer.com",
        publishedAt: new Date().toISOString()
      }
    ];

    res.json(fallback);
    }
});

module.exports = router;