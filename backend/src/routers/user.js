const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');
const router = new express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 */
router.post('/users', async(req, res) => {
    const user = new User(req.body);

    try{
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e){
        res.status(400).send(e);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid email or password
 */
router.post('/users/login', async(req, res) => {
    
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e){
        res.status(400).send();
    }
});


/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Log out the current session (invalidate this token only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 *       500:
 *         description: Server error
 */
router.post('/users/logout', auth, async (req, res) => {
    
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
    })
    await req.user.save();

    res.send();
    } catch (e) {
        res.status(500).send();
    }
});

/**
 * @swagger
 * /users/logoutAll:
 *   post:
 *     summary: Log out of all sessions (invalidate every token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out of all sessions
 *       500:
 *         description: Server error
 */
router.post('/users/logoutAll', auth, async (req, res) => {
    
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the logged-in user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/users/me', auth, async(req, res) => {
    res.send(req.user);
 });

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 */
router.get('/health', (req, res) => {
    res.status(200).send({status:'OK'});
});

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update the logged-in user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid update fields or validation error
 */
router.patch('/users/me' , auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error : 'Invalid Updates!'})
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
});

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete the logged-in user's account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router.delete('/users/me', auth, async(req, res) => {
    try{
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch(e){
        res.status(500).send();
    }
});

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an Image!'))
        }

        cb(undefined, true);
    }
});

/**
 * @swagger
 * /users/me/avatar:
 *   post:
 *     summary: Upload/replace the logged-in user's avatar image
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded
 *       400:
 *         description: No file uploaded, or file isn't a jpg/jpeg/png
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' })
    }

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

/**
 * @swagger
 * /users/me/avatar:
 *   delete:
 *     summary: Remove the logged-in user's avatar image
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar removed
 */
router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
});

/**
 * @swagger
 * /users/{id}/avatar:
 *   get:
 *     summary: Get a user's avatar image
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Avatar image
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: User or avatar not found
 */
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
});

module.exports = router;