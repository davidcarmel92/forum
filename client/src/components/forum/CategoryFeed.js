import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CategoryFeedItem from './CategoryFeedItem';
import Spinner from '../common/Spinner';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getPostsByCategory } from '../../actions/postsActions.js'

class CategoryFeed extends Component {

  componentDidMount() {

    const category = this.props.match.params.category;
    if(category){
      this.props.getPostsByCategory(category);
    }

  }

  render() {

    let feed;

    const { posts } = this.props.posts;
    const category = this.props.match.params.category;

    if(posts){
      feed = posts.map(post => (
          <CategoryFeedItem key={post._id} post={post} />
      ));
    } else {
      feed = (<div><Spinner /></div>);
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-10">
            <h2>{category}</h2>
          </div>
          <div className="col-sm-2">
            {this.props.auth.isAuthenticated ? (
              <Link to={`/add-post`} className="post-link btn btn-light">
                Add Post
              </Link>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="col-1">
          </div>
          <div className="col-6">
            <h4 className="ml-3">Topic</h4>
          </div>
          <div className="col-3">
            <h4>Replies</h4>
          </div>
          <div className="col-2">
            <h4>Last Post</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <ul className="list-group">
              {feed}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}




CategoryFeed.propTypes = {
  getPostsByCategory: PropTypes.func.isRequired,
  posts: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  posts: state.posts,
  auth: state.auth
})

export default connect(mapStateToProps, { getPostsByCategory })(CategoryFeed)
