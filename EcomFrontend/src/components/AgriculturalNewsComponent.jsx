import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Button } from './Button';
import './AgriculturalNewsComponent.css';
import axios from 'axios';
import MorphingLoader from './MorphingLoader';

const AgriculturalNewsComponent = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await axios.get(`${API_BASE_URL}/api/agriculture/news`);
        setNewsItems(data.data);
        setIsLoading(false);
        console.log(data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = Array.isArray(newsItems) 
  ? newsItems.filter(item => 
      filter === 'all' || 
      (filter === 'news' && !item.type) || 
      item.type === filter
    )
  : [];


  if (isLoading) {
    return (
      <MorphingLoader />
    );
  }

  return (
    <div className="news-container">
      <Card>
        <CardHeader>
          <div className="header">
            <CardTitle>Agricultural News & Schemes</CardTitle>
            <div className="button-container">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'news' ? 'default' : 'outline'}
                onClick={() => setFilter('news')}
              >
                News
              </Button>
              <Button 
                variant={filter === 'scheme' ? 'default' : 'outline'}
                onClick={() => setFilter('scheme')}
              >
                Schemes
              </Button>
              <Button 
  variant={filter === 'blog' ? 'default' : 'outline'}
  onClick={() => setFilter('blog')}
>
  Blogs
</Button>
<Button 
  variant={filter === 'fertilizer-price' ? 'default' : 'outline'}
  onClick={() => setFilter('fertilizer-price')}
>
  Fertilizer Prices
</Button>
<Button 
  variant={filter === 'fertilizer-guideline' ? 'default' : 'outline'}
  onClick={() => setFilter('fertilizer-guideline')}
>
  Fertilizer Guidelines
</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNews.length === 0 ? (
            <p className="no-items">No items found.</p>
          ) : (
            <div className="news-list">
              {filteredNews.map((item, index) => (
                <div 
                  key={index} 
                  className={`news-item ${item.type === 'scheme' ? 'scheme' : 'news'}`}
                >
                  <div className="news-info">
                    <h3 className="title">{item.title}</h3>
                    <p className="description">{item.description}</p>
                  </div>
                  <div className="news-details">
                    <p className="source">{item.source || 'Unknown Source'}</p>
                    <p className="date">{item.published_date || 'No date'}</p>
                  </div>
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="read-more"
                  >
                    Read More
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgriculturalNewsComponent;
