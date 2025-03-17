import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

function Articles() {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { getToken } = useAuth();

  // Fetch all articles
  async function getArticles() {
    try {
      const token = await getToken()
      let res = await axios.get('http://localhost:3000/author-api/articles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (res.data.message === 'articles') {
        setArticles(res.data.payload)
        setFilteredArticles(res.data.payload)
        setError('')
        // Extract unique categories
        const uniqueCategories = [...new Set(res.data.payload.map(article => article.category))]
        setCategories(uniqueCategories)
      } else {
        setError(res.data.message)
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
      setError("Failed to fetch articles")
    }
  }

  // Navigate to specific article
  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj })
  }

  // Handle category change
  function handleCategoryChange(event) {
    setSelectedCategory(event.target.value)
    if (event.target.value === "") {
      setFilteredArticles(articles)
    } else {
      setFilteredArticles(articles.filter(article => article.category === event.target.value))
    }
  }

  useEffect(() => {
    getArticles()
  }, [])

  return (
    <div className='container'>
      {error && <p className='display-4 text-center mt-5 text-danger'>{error}</p>}
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Articles</h2>
        {/* Category Filter */}
        <div>
          <label className="me-2">Filter by Category:</label>
          <select value={selectedCategory} onChange={handleCategoryChange} className="form-select">
            <option value="">All</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 '>
        {
          filteredArticles.map((articleObj) => (
            <div className='col' key={articleObj.articleId}>
              <div className="card h-100">
                <div className="card-body">
                  {/* Author Details */}
                  <div className="author-details text-end">
                    <img src={articleObj.authorData.profileImageUrl}
                      width='40px'
                      className='rounded-circle'
                      alt="" />
                    <p><small className='text-secondary'>{articleObj.authorData.nameOfAuthor}</small></p>
                  </div>
                  {/* Article Title */}
                  <h5 className='card-title'>{articleObj.title}</h5>
                  {/* Article Content Preview */}
                  <p className='card-text'>{articleObj.content.substring(0, 80) + "...."}</p>
                  {/* Read More Button */}
                  <button className='custom-btn btn-4' onClick={() => gotoArticleById(articleObj)}>
                    Read more
                  </button>
                </div>
                <div className="card-footer">
                  {/* Article's Last Modified Date */}
                  <small className="text-body-secondary">Last updated on {articleObj.dateOfModification}</small>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Articles
