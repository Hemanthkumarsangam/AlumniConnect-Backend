const express = require('express');
const User = require('../models/userModel');
const Posts = require('../models/postModel');

const postApp = express.Router();

postApp.post('/addPost', async (req, res) => {
    try {
        const date = new Date();
        date.setHours(date.getHours() + 5);
        date.setMinutes(date.getMinutes() + 30);

        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).send({ message: 'User not found' });

        const post = new Posts({
            ...req.body,
            likes: 0,
            likedUsers: [], // Track users who liked
            author: user.name,
            authorImage: user.imageUrl,
            date
        });

        await post.save();
        res.send({ message: 'Post added successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error adding post', error });
    }
});

postApp.patch('/addComment', async (req, res) => {
    try {
        const { postId, email, comment } = req.body;
        const post = await Posts.findById(postId);
        const user = await User.findOne({email})
        if (!post) return res.status(404).send({ message: 'Post not found' });
        if (!user) return res.status(404).send({ message: 'User not found' });
        post.comments.push({user: user.name, userImage: user.imageUrl, comment});
        await post.save();
        res.send({ message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error adding comment', error });
    }
});

// Updated Like Route (Tracks Users Who Liked)
postApp.patch('/addLike/:id', async (req, res) => {
    try {
        const { email } = req.body;
        const post = await Posts.findById(req.params.id);

        if (!post) return res.status(404).send({ message: 'Post not found' });
        if (post.likedUsers.includes(email)) return res.status(400).send({ message: 'Already liked' });

        post.likes += 1;
        post.likedUsers.push(email);
        await post.save();

        res.send({ message: 'Like added successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error adding like', error });
    }
});

// Updated Unlike Route (Removes User from Liked List)
postApp.patch('/removeLike/:id', async (req, res) => {
    try {
        const { email } = req.body;
        const post = await Posts.findById(req.params.id);

        if (!post) return res.status(404).send({ message: 'Post not found' });
        if (!post.likedUsers.includes(email)) return res.status(400).send({ message: 'Not liked yet' });

        post.likes -= 1;
        post.likedUsers = post.likedUsers.filter(id => id !== email);
        await post.save();

        res.send({ message: 'Like removed successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error removing like', error });
    }
});

postApp.get('/getPosts', async (req, res) => {
    try {
        const posts = await Posts.find();
        res.send(posts);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching posts', error });
    }
});

postApp.get('/getPost/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (!post) return res.status(404).send({ message: 'Post not found' });
        res.send(post);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching post', error });
    }
});

postApp.delete('/deletePost/:id', async (req, res) => {
    try {
        await Posts.findByIdAndDelete(req.params.id);
        res.send({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting post', error });
    }
});

module.exports = postApp;
