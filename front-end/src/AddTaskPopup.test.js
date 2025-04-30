import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { MemoryRouter, useLocation } from 'react-router'
import AddTaskPopup from '../src/AddTaskPopup'

describe('<AddTaskPopup />', () => {
    let wrapper, fetchStub, navigateSpy, alertStub

    beforeEach(() => {
        alertStub = sinon.stub(window, 'alert')
        fetchStub = sinon.stub(global, 'fetch').resolves({ json: () => Promise.resolve({}) })
        navigateSpy = sinon.spy()

        wrapper = mount(
            <MemoryRouter>
            <AddTaskPopup />
        </MemoryRouter>
        )
        wrapper.find('AddTaskPopup').instance().navigate = navigateSpy
    })

    afterEach(() => {
        sinon.restore()
        wrapper.unmount()
    })

    it('shows alert on missing fields', () => {
        wrapper.find('button.save-button').simulate('click')
        expect(alertStub.calledWith('Please fill in all fields.')).to.be.true
    })

    it('validates date format', () => {
        wrapper.find('input#tname').simulate('change', { target: { value: 'Task1' } })
        wrapper.find('input#deadline').simulate('change', { target: { value: 'not-a-date' } })
        wrapper.find('button.save-button').simulate('click')
        expect(alertStub.calledWith('Please enter a valid date in YYYY-MM-DD format.')).to.be.true
    })

    it('posts correct payload when saving a new task', async () => {
        wrapper.find('input#tname').simulate('change', { target: { value: 'Task1' } })
        wrapper.find('input#deadline').simulate('change', { target: { value: '2025-06-01' } })
        wrapper.find('button').filterWhere(n => n.text() === 'To-do').simulate('click')
        await wrapper.find('button.save-button').simulate('click')
        await Promise.resolve()

        expect(fetchStub.calledOnce).to.be.true
        const [url, opts] = fetchStub.firstCall.args
        expect(url).to.match(/\/api\/tasks$/)
        const payload = JSON.parse(opts.body)
        expect(payload).to.include({ title: 'Task1', status: 'todo' })

        expect(new Date(payload.deadline).getDate()).to.equal(2)
        expect(opts.method).to.equal('POST')
        expect(navigateSpy.calledWith('/todo')).to.be.true
    })
})