const mongoose = require('mongoose');
const User = require('../src/models/user');
const Task = require('../src/models/task');

const days = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

const accounts = {
    demo: {
        name: 'Demo User',
        email: 'demo@taskmanager.app',
        password: 'DemoAccess2026',
        age: 28
    },
    alex: {
        name: 'Alex Carter',
        email: 'alex@taskmanager.app',
        password: 'AlexDemo2026',
        age: 31
    },
    elham: {
        name: 'Elham Khan',
        email: 'elham@taskmanager.app',
        password: 'ElhamDemo2026',
        age: 27
    }
};

const demoTasks = [
    { description: 'Submit quarterly budget report', priority: 'high', category: 'work', tags: ['finance', 'deadline'], dueDate: days(-4), completed: false },
    { description: 'Renew apartment lease agreement', priority: 'high', category: 'personal', tags: ['urgent'], dueDate: days(-1), completed: false },
    { description: 'Prepare slides for client demo', priority: 'high', category: 'work', tags: ['presentation'], dueDate: days(1), completed: false, shared: ['alex', 'elham'] },
    { description: 'Review pull requests from the team', priority: 'medium', category: 'work', tags: ['code-review'], dueDate: days(2), completed: false, shared: ['alex'] },
    { description: 'Plan the sprint retrospective', priority: 'medium', category: 'work', tags: ['agile', 'team'], dueDate: days(4), completed: false, shared: ['elham'] },
    { description: 'Book flights for the conference', priority: 'medium', category: 'work', tags: ['travel', 'conference'], dueDate: days(5), completed: false },
    { description: 'Finish Vue Router deep dive course', priority: 'medium', category: 'learning', tags: ['vue', 'frontend'], dueDate: days(7), completed: false },
    { description: 'Read chapter on MongoDB aggregation', priority: 'low', category: 'learning', tags: ['mongodb', 'backend'], dueDate: days(10), completed: false },
    { description: 'Practice system design interview questions', priority: 'high', category: 'learning', tags: ['interview'], dueDate: days(3), completed: false },
    { description: 'Buy groceries for the week', priority: 'low', category: 'shopping', tags: ['weekly'], dueDate: days(1), completed: false },
    { description: 'Order a replacement laptop charger', priority: 'medium', category: 'shopping', tags: ['electronics'], dueDate: days(4), completed: false },
    { description: 'Pick up dry cleaning', priority: 'low', category: 'personal', tags: ['errand'], completed: false },
    { description: 'Schedule dentist appointment', priority: 'low', category: 'personal', tags: ['health'], dueDate: days(14), completed: false },
    { description: 'Deploy backend to production', priority: 'high', category: 'work', tags: ['devops', 'deployment'], dueDate: days(-2), completed: true },
    { description: 'Write API documentation with Swagger', priority: 'medium', category: 'work', tags: ['documentation'], dueDate: days(-3), completed: true, shared: ['elham'] },
    { description: 'Set up MongoDB Atlas cluster', priority: 'medium', category: 'work', tags: ['database'], dueDate: days(-5), completed: true },
    { description: 'Complete Tailwind CSS fundamentals', priority: 'low', category: 'learning', tags: ['css', 'tailwind'], dueDate: days(-6), completed: true },
    { description: 'Cancel unused streaming subscription', priority: 'low', category: 'personal', tags: ['finance'], completed: true },
    { description: 'Restock coffee beans', priority: 'low', category: 'shopping', tags: ['weekly'], completed: true }
];

const alexTasks = [
    { description: 'Design the new onboarding flow', priority: 'high', category: 'work', tags: ['design', 'ux'], dueDate: days(3), completed: false, shared: ['demo'] },
    { description: 'Migrate user avatars to object storage', priority: 'medium', category: 'work', tags: ['backend', 'storage'], dueDate: days(6), completed: false, shared: ['demo'] },
    { description: 'Plan the team offsite agenda', priority: 'low', category: 'work', tags: ['planning'], dueDate: days(12), completed: false, shared: ['demo'] },
    { description: 'Audit accessibility on the dashboard', priority: 'medium', category: 'work', tags: ['a11y', 'frontend'], dueDate: days(-1), completed: false, shared: ['demo'] },
    { description: 'Update the shared component library', priority: 'medium', category: 'work', tags: ['frontend'], dueDate: days(-4), completed: true, shared: ['demo'] }
];

const elhamTasks = [
    { description: 'Build the task sharing feature end to end', priority: 'high', category: 'work', tags: ['fullstack', 'feature'], dueDate: days(2), completed: false, shared: ['demo'] },
    { description: 'Add Swagger documentation for every endpoint', priority: 'high', category: 'work', tags: ['documentation', 'api'], dueDate: days(-2), completed: true, shared: ['demo'] },
    { description: 'Redesign the dashboard with Tailwind', priority: 'medium', category: 'work', tags: ['ui', 'tailwind'], dueDate: days(5), completed: false, shared: ['demo'] },
    { description: 'Write integration tests for the auth flow', priority: 'medium', category: 'work', tags: ['testing', 'jest'], dueDate: days(8), completed: false, shared: ['demo'] },
    { description: 'Set up CI checks before merging', priority: 'low', category: 'work', tags: ['devops'], dueDate: days(11), completed: false },
    { description: 'Study JWT refresh token strategies', priority: 'medium', category: 'learning', tags: ['auth', 'security'], dueDate: days(9), completed: false },
    { description: 'Prepare portfolio walkthrough notes', priority: 'high', category: 'personal', tags: ['career'], dueDate: days(1), completed: false, shared: ['demo'] }
];

const createUser = async (details) => {
    const existing = await User.findOne({ email: details.email });

    if (existing) {
        await Task.deleteMany({ owner: existing._id });
        await User.deleteOne({ _id: existing._id });
    }

    const user = new User(details);
    await user.save();
    return user;
};

const createTasks = async (list, owner, users) => {
    let count = 0;

    for (const item of list) {
        const { shared, ...fields } = item;

        const task = new Task({
            ...fields,
            owner: owner._id,
            sharedWith: (shared || []).map((key) => users[key]._id)
        });

        await task.save();
        count++;
    }

    return count;
};

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log('Connected to database');

    const users = {};

    for (const [key, details] of Object.entries(accounts)) {
        users[key] = await createUser(details);
        console.log('Created user:', details.email);
    }

    const demoCount = await createTasks(demoTasks, users.demo, users);
    const alexCount = await createTasks(alexTasks, users.alex, users);
    const elhamCount = await createTasks(elhamTasks, users.elham, users);

    console.log('Tasks owned by Demo User:', demoCount);
    console.log('Tasks owned by Alex Carter:', alexCount);
    console.log('Tasks owned by Elham Khan:', elhamCount);

    await mongoose.disconnect();
    console.log('Done');
};

run().catch((e) => {
    console.log('Seeding failed:', e.message);
    process.exit(1);
});
