import React, { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import './Comments.css';
import { FaUserAlt } from "react-icons/fa";
import { IoStar } from "react-icons/io5";
import { FaCommentAlt } from "react-icons/fa";
import { useTheme } from '@mui/material/styles';

const Comments = () => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [numComments, setNumComments] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const theme = useTheme();
  
  const commentBoxStyle = {
    backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#B6C4D3',
  };

  useEffect(() => {
    const fetchStoryAndComments = async () => {
      try {
        const storyId = new URLSearchParams(window.location.search).get('storyId');
        const apiUrl = `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`;

        setLoading(true);

        const response = await fetch(apiUrl);
        const story = await response.json();

        if (!story) {
          setStory(null);
        } else {
          setStory(story);
          const commentIds = story.kids.slice(0, numComments);
          const commentPromises = commentIds.map((commentId) => {
            const commentUrl = `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`;
            return fetch(commentUrl).then((response) => response.json());
          });
          const fetchedComments = await Promise.all(commentPromises);
          setComments(fetchedComments);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching story:', error);
        setLoading(false);
      }
    };

    fetchStoryAndComments();
  }, [numComments]);

  const renderComments = (comment, depth = 0, index) => {
    if (depth > 3) {
      return null;
    }
  
    const commentStyle = {
      marginLeft: `${depth * 20}px`, // Adjust margin based on depth
    };
  
    return (
      <li key={comment.id} style={commentStyle}>
        <div className="comment-box" style={commentBoxStyle}>
          <FaUserAlt /> 
          <b>{comment.by}</b>
          <br />
          <div dangerouslySetInnerHTML={{ __html: comment.text }} />
        </div>
  
        {comment.replies && comment.replies.length > 0 && (
          <ul>{comment.replies.map((reply, subIndex) => renderComments(reply, depth + 1, subIndex + 1))}</ul>
        )}
      </li>
    );
  };
  

  const handleLoadMoreComments = async () => {
    setIsLoadingMore(true);
    setNumComments(numComments + 5);
    setIsLoadingMore(false);
  };

  const renderCommentsList = () => {
    return (
      <ul id="commentList">
        {comments.map((comment) => renderComments(comment))}
      </ul>
    );
  };

  return (
    <div>
      {loading ? (
        // Skeleton Loading Screen
        <div className='skeleton-container'>
          <Skeleton variant="text" height={'35vh'} className='skeleton' animation="wave" />
          <Skeleton variant="text" height={'15vh'} className='skeleton' animation="wave" />
          <Skeleton variant="text" height={'25vh'} className='skeleton' animation="wave" />
          <Skeleton variant="text" height={'10vh'} className='skeleton' animation="wave" />
          <Skeleton variant="text" height={'5vh'} className='skeleton' animation="wave" />
        </div>
      ) : (
        <>
          <div className="comments-wrapper">
            <h3>
              <a className="news-url" href={story.url} target="_blank" rel="noopener noreferrer">
                {story.title}
              </a>
            </h3>
            <div className="news-details">
              <span className="detail">
              <IoStar data-story-id={story.id} />{story.score}
              </span>
              <span className="detail comment"><FaCommentAlt data-story-id={story.id} /> {story.descendants}
              </span>
              <span className="detail">
              <FaUserAlt />{story.by}
              </span>
            </div>
            {renderCommentsList()}
            {isLoadingMore && <div>Loading more comments...</div>}
            <button id="loadMoreComments" onClick={handleLoadMoreComments} disabled={isLoadingMore}>
              Load More Comments
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Comments;
