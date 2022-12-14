const mongoose = require('mongoose');
const app = require('../app');
const supertest = require('supertest');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[2]);
  await blogObject.save();
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('blog has id property', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].id).toBeDefined();
});

test('a valid note can be added', async () => {
  const newBlog = {
    title: 'newnotes',
    author: 'Edith Weaver',
    url: 'http://sucipu.bh/marpati',
    likes: 2
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  const blogAtEnd = await helper.blogsInDb();

  expect(blogAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const urls = blogAtEnd.map(blog => blog.url);
  expect(urls).toContain('http://sucipu.bh/marpati');
});
test('deletion of a note', async () => {
  //status
  const blogAtStart = await helper.blogsInDb();
  const blogToDelete = blogAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204);
  const blogAtEnd = await helper.blogsInDb();
  expect(blogAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const urls = blogAtEnd.map(blog => blog.url);
  console.log(urls);
  expect(urls).not.toContain(blogToDelete.url);

});

test('update a blog likes', async () => {

  const blogAtStart = await helper.blogsInDb();
  const updatedLikes = {
    likes: blogAtStart[0].likes + 5
  };

  const recetivedBlog = {
    ...blogAtStart[0],
    ...updatedLikes
  };


  await api
    .put(`/api/blogs/${blogAtStart[0].id}`)
    .send(updatedLikes)
    .expect(200)
    .expect(recetivedBlog);

  const blogAtEnd = await helper.blogsInDb();

  expect(blogAtEnd[0].likes).toBe(updatedLikes.likes);

});
afterAll(() => {
  mongoose.connection.close();
});