const express = require('express');
const User = require('../models/user');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();


/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 */
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

/**
 * @swagger
 * /tasks/{id}/share:
 *   post:
 *     summary: Share a task with another user by email
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShareRequest'
 *     responses:
 *       200:
 *         description: Task shared
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Missing email, user not found, or already shared
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not the task owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
/**
 * @swagger
 * /tasks/{id}/unshare:
 *   delete:
 *     summary: Remove a user's access to a shared task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShareRequest'
 *     responses:
 *       200:
 *         description: Task unshared
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Missing email, user not found, or not shared with this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not the task owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all of the logged-in user's tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: dueDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: "Format: field:asc or field:desc, e.g. dueDate:desc"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /tasks/shared:
 *   get:
 *     summary: Get tasks that other users have shared with the logged-in user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: dueDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: "Format: field:asc or field:desc, e.g. dueDate:desc"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of shared tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     security: 
 *       - bearerAuth: []
 *     parameters: 
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
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

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdate'
 *     responses:
 *       200:
 *         description: Task updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid update fields
 *       403:
 *         description: Not allowed to make this change
 *       404:
 *         description: Task not found
 */
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

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
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