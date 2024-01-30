import React, { useState, useEffect } from 'react';
import './Front.css';
import NewsList from './NewsList';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';

const Front = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [storyIds, setStoryIds] = useState([]);

  useEffect(() => {
    const fetchStoryIds = async () => {
      try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const allStoryIds = await response.json();
        setStoryIds(allStoryIds);

        const calculatedTotalPages = Math.ceil(allStoryIds.length / newsPerPage);
        setTotalPages(calculatedTotalPages);
      } catch (error) {
        console.error('Error fetching story IDs:', error);
      }
    };

    fetchStoryIds();
  }, [newsPerPage]);

  useEffect(() => {
    const fetchPageStories = async () => {
      try {
        setLoading(true);

        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyIds = await response.json();

        const startIndex = (currentPage - 1) * newsPerPage;
        const endIndex = startIndex + newsPerPage;
        const pageStoryIds = storyIds.slice(startIndex, endIndex);

        const promises = pageStoryIds.map(async (id) => {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return storyResponse.json();
        });

        const stories = await Promise.all(promises);

        setNews(stories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchPageStories();
  }, [currentPage, newsPerPage, storyIds]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className='pagination'>
      {loading ? (
        <div className='skeleton-container'>
          <Skeleton variant="text" height={'20vh'} className='skeleton' animation="wave" />
          <Skeleton variant="text" height={'20vh'} className='skeleton' animation="wave" />
          <Skeleton variant="text" height={'20vh'} className='skeleton' animation="wave" />
          <Skeleton variant="text" height={'20vh'} className='skeleton' animation="wave" />
          <Skeleton variant="text" height={'20vh'} className='skeleton' animation="wave" />
        </div>
      ) : (
        <div>
          <NewsList news={news} />
          <Pagination 
            className='pages' 
            variant="outlined" 
            shape="rounded" 
            count={totalPages} 
            page={currentPage} 
            onChange={handlePageChange} 
            classes={{ root: 'custom-pagination-root' }}
          />
        </div>
      )}
    </div>
  );
};

export default Front;
