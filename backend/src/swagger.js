const swaggerJsdoc = require('swagger-jsdoc')

const options = {
    definition:{
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '1.0.0',
            description: 'API documentation for the Task Manager app'

        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Task: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d5ec49f1b2c8b1f8e4e1a1' },
                        description: { type: 'string', example: 'Buy groceries' },
                        completed: { type: 'boolean', example: false },
                        priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
                        dueDate: { type: 'string', format: 'date-time', example: '2026-08-10T00:00:00.000Z' },
                        category: { type: 'string', example: 'personal' },
                        tags: { type: 'array', items: { type: 'string' }, example: ['shopping'] },
                        owner: { type: 'string', example: '60d5ec49f1b2c8b1f8e4e1a2' },
                        sharedWith: { type: 'array', items: { type: 'string' }, example: [] }
                    }
                },
                TaskInput: {
                    type: 'object',
                    required: ['description'],
                    properties: {
                        description: { type: 'string', example: 'Buy groceries' },
                        priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
                        dueDate: { type: 'string', format: 'date-time', example: '2026-08-10T00:00:00.000Z' },
                        category: { type: 'string', example: 'personal' },
                        tags: { type: 'array', items: { type: 'string' }, example: ['shopping'] }
                    }
                },
                TaskUpdate: {
                    type: 'object',
                    properties: {
                        description: { type: 'string', example: 'Buy groceries' },
                        completed: { type: 'boolean', example: true },
                        priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
                        dueDate: { type: 'string', format: 'date-time', example: '2026-08-10T00:00:00.000Z' },
                        category: { type: 'string', example: 'personal' },
                        tags: { type: 'array', items: { type: 'string' }, example: ['shopping'] }
                    }
                },
                ShareRequest: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                        email: { type: 'string', example: 'friend@example.com' }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d5ec49f1b2c8b1f8e4e1a2' },
                        name: { type: 'string', example: 'Elham' },
                        email: { type: 'string', example: 'elham@example.com' },
                        age: { type: 'number', example: 25 }
                    }
                },
                UserInput: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'Elham' },
                        email: { type: 'string', example: 'elham@example.com' },
                        password: { type: 'string', example: 'mySecret123' },
                        age: { type: 'number', example: 25 }
                    }
                },
                UserLogin: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', example: 'elham@example.com' },
                        password: { type: 'string', example: 'mySecret123' }
                    }
                },
                UserUpdate: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'Elham' },
                        email: { type: 'string', example: 'elham@example.com' },
                        password: { type: 'string', example: 'mySecret123' },
                        age: { type: 'number', example: 25 }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        user: { $ref: '#/components/schemas/User' },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Something went wrong' }
                    }
                }
            }
        }
    },
    apis: ['./src/routers/*.js']
}

const swaggerSpec = swaggerJsdoc(options) 
module.exports = swaggerSpec