const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'r2',
    author: 'Anne Figueroa',
    url: 'http://coka.ie/ifoho',
    likes: 5
  },
  {
    title: 'r2',
    author: 'Brent King',
    url: 'http://lucbed.tt/je',
    likes: 3
  },
  {
    title: 'rrrr',
    author: 'Rena Campbell',
    url: 'http://gisluro.my/iguneob',
    likes: 10
  }
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

module.exports = {
  initialBlogs, blogsInDb
};