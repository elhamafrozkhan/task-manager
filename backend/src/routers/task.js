const express = require('express');
const User = require('../models/user');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();


router.post('/tasks', auth, async(req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try{
        await task.save();
        res.status(201).send(task);
    } catch (e){
        res.status(400).send(e);
    }
    
});

router.post('/tasks/:id/share', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }
        if (task.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'Not authorized to share this task' });
        }
        
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ error: 'Email is required' });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        const alreadyShared = task.sharedWith.some(
            (id) => id.toString() === user._id.toString()
        );

        if (alreadyShared) {
            return res.status(400).send({ error: 'Task already shared with this user' });
        }

        task.sharedWith.push(user._id);

        await task.save();
        res.send(task);

    } catch (e) {
        res.status(500).send(e);
    }
});
router.delete('/tasks/:id/unshare', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        if (task.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'Not authorized to unshare this task' });
        }

        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ error: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        const isShared = task.sharedWith.some(
            (sharedUserId) => sharedUserId.toString() === user._id.toString()
        );

        if (!isShared) {
            return res.status(400).send({ error: 'Task is not shared with this user' });
        }

        task.sharedWith = task.sharedWith.filter(
            (sharedUserId) => sharedUserId.toString() !== user._id.toString()
        );

        await task.save();
        res.send(task);

    } catch (e) {
        res.status(500).send(e);
    }
});

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=0
router.get('/tasks', auth, async(req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if (req.query.priority) {
        match.priority = req.query.priority;
    }
    if (req.query.category) {
        match.category = req.query.category;
    }
    if (req.query.dueDate) {
        match.dueDate = req.query.dueDate  
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    
    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            },
            populate: {
                path: 'sharedWith',
                select: 'name email'
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e){
        res.status(500).send();
    }

});

router.get('/tasks/shared', auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.priority) {
        match.priority = req.query.priority;
    }

    if (req.query.category) {
        match.category = req.query.category;
    }

    if (req.query.dueDate) {
        match.dueDate = req.query.dueDate;
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        const tasks = await Task.find({
            sharedWith: req.user._id,
            ...match
        }).populate({
            path: 'owner',
            select: 'name email avatar'
        })
        .limit(parseInt(req.query.limit))
        .skip(parseInt(req.query.skip))
        .sort(sort);

        res.send(tasks);

    } catch (e) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id;

     try{
        const task = await Task.findOne( { _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send()
        }
    res.send(task);

    }catch(e){
        res.status(500).send()
    }
});

router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed', 'priority', 'dueDate', 'category', 'tags'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error : 'Invalid Updates!'})
    }

    try{
        const task = await Task.findOne({ 
            _id: req.params.id, 
            $or: [
                { owner: req.user._id },
                { sharedWith: req.user._id }
            ]
        });

        if(!task){
            return res.status(404).send()
        }
        const isOwner = task.owner.toString() === req.user._id.toString()

        if (!isOwner) {
            const onlyChangingCompleted = updates.length === 1 && updates[0] === 'completed'

            if (!onlyChangingCompleted) {
                return res.status(403).send({ error: 'Shared users can only mark tasks complete' })
            }
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);
    }catch(e){
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async(req, res) => {
    try{
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if(!task){
            return res.status(404).send()
        }
        res.send(task);
    } catch(e){
        res.status(500).send();
    }
});

module.exports = router;