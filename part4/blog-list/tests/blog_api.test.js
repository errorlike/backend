const mongoose = require('mongoose');
const app = require('../app');
const supertest = require('supertest');
const Blog = require('../models/blog');

const api = supertest(app);

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
beforeEach(async () => {
    await Blog.deleteMany({});
    let blogObject = new Blog(initialBlogs[0]);
    await blogObject.save();
    blogObject = new Blog(initialBlogs[1]);
    await blogObject.save();
    blogObject = new Blog(initialBlogs[2]);
    await blogObject.save();
});

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
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
    const blogInDB = await Blog.find({});
    console.log(blogInDB);
    blogAtEnd = blogInDB.map(blog => blog.toJSON());

    expect(blogInDB).toHaveLength(initialBlogs.length + 1);

    const urls = blogAtEnd.map(blog => blog.url);
    expect(urls).toContain('http://sucipu.bh/marpati');
});
afterAll(() => {
    mongoose.connection.close();
    expect;
});