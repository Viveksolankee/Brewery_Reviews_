
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Brewery.css';

function Brewery() {
  const { id } = useParams();
  const [brewery, setBrewery] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchBrewery = async () => {
      const response = await axios.get(`https://api.openbrewerydb.org/breweries/${id}`);
      setBrewery(response.data);
    };
    const fetchReviews = async () => {
      const response = await axios.get(`http://localhost:5000/reviews/${id}`);
      setReviews(response.data);
    };
    fetchBrewery();
    fetchReviews();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/reviews',
        { breweryId: id, rating, description },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const response = await axios.get(`http://localhost:5000/reviews/${id}`);
      setReviews(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Server Error:', error.response.data);
      } else if (error.request) {
        console.error('No Response:', error.request);
      } else {
        console.error('Request Setup Error:', error.message);
      }
    }
  };

  return (
    <div className="brewery-container">
      <div className="brewery-header">
        <h1>{brewery.name}</h1>
        <p>{brewery.street}, {brewery.city}, {brewery.state}</p>
        <p>{brewery.phone}</p>
        <p><a href={brewery.website_url}>Website</a></p>
      </div>
      <div className="brewery-reviews">
        <h2>Reviews</h2>
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review._id}>
              <strong>{review.user.username}</strong>: {review.description} (Rating: {review.rating})
            </li>
          ))}
        </ul>
      </div>
      <div className="add-review">
        <h2>Add a Review</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            id="rating"
            name="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            placeholder="Rating (1-5)"
          />
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your review here"
          ></textarea>
          <button type="submit">Submit</button>
        
        </form>
      </div>
    </div>
  );
}

export default Brewery;
