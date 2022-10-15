const blogRouter = require('express').Router();
const Blog = require('../models/blog');
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  await blog.save();
  response.status(201).json(blog);
});

blogRouter.delete('/:id', async (request, response) => {
  console.log('request', request.params.id);
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const blog = {
    likes: body.likes || 0
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  response.json(updatedBlog);
});

module.exports = blogRouter;