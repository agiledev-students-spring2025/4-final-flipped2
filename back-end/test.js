import { expect } from 'chai';
import request from 'supertest';
import { app } from './server.mjs';

// Todo section test
describe('ToDo API', () => {
    describe('GET /api/tasks', () => {
        it('should return all tasks', async () => {
            const res = await request(app).get('/api/tasks');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });
    });

    describe('GET /api/tasks/:status', () => {
        it('should return tasks with matching status', async () => {
            const res = await request(app).get('/api/tasks/todo');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body.every(task => task.status === 'todo')).to.be.true;
        });
    });

    describe('GET /api/task/:id', () => {
        it('should return a single task', async () => {
            const res = await request(app).get('/api/task/1');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.id).to.equal(1);
        });

        it('should return 404 for non-existent task', async () => {
            const res = await request(app).get('/api/task/999');
            expect(res.status).to.equal(404);
        });
    });

    describe('POST /api/tasks', () => {
        it('should create a new task', async () => {
            const newTask = {
                title: 'New Task',
                status: 'todo',
                deadline: '2025-03-25'
            };

            const res = await request(app)
                .post('/api/tasks')
                .send(newTask);

            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body.title).to.equal(newTask.title);
        });

        it('should return 400 for missing required fields', async () => {
            const res = await request(app)
                .post('/api/tasks')
                .send({ title: 'Incomplete Task' });

            expect(res.status).to.equal(400);
        });
    });

    describe('PUT /api/tasks/:id', () => {
        it('should update an existing task', async () => {
            const updatedTask = {
                title: 'Updated Task',
                status: 'in-progress',
                deadline: '2025-03-26'
            };

            const res = await request(app)
                .put('/api/tasks/1')
                .send(updatedTask);

            expect(res.status).to.equal(200);
            expect(res.body.title).to.equal(updatedTask.title);
        });

        it('should return 404 for non-existent task', async () => {
            const res = await request(app)
                .put('/api/tasks/999')
                .send({ title: 'Nonexistent Task' });

            expect(res.status).to.equal(404);
        });
    });

    describe('PATCH /api/tasks/:id/status', () => {
        it('should update task status', async () => {
            const res = await request(app)
                .patch('/api/tasks/1/status')
                .send({ status: 'done' });

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('done');
        });

        it('should return 400 for missing status', async () => {
            const res = await request(app)
                .patch('/api/tasks/1/status')
                .send({});

            expect(res.status).to.equal(400);
        });
    });

    describe('DELETE /api/tasks/:id', () => {
        it('should delete a task', async () => {
            const res = await request(app).delete('/api/tasks/1');
            expect(res.status).to.equal(200);
            expect(res.body.id).to.equal(1);
        });

        it('should return 404 for non-existent task', async () => {
            const res = await request(app).delete('/api/tasks/999');
            expect(res.status).to.equal(404);
        });
    });

    describe('GET /api/calendar', () => {
        it('should return calendar data', async () => {
            const res = await request(app).get('/api/calendar');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('dates');
            expect(res.body).to.have.property('tasks');
        });
    });

    // Todo section test end
});