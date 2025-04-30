// test/AddEventPopup.test.js
import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { MemoryRouter } from 'react-router'  // to wrap useNavigate
import AddEventPopup from '../src/AddEventPopup'

describe('<AddEventPopup />', () => {
    let wrapper, fetchStub, navigateStub, alertStub

    beforeEach(() => {
        alertStub = sinon.stub(window, 'alert')
        fetchStub = sinon.stub(global, 'fetch').resolves({
            json: () => Promise.resolve({}),
            ok: true
        })

    navigateStub = sinon.spy()

    wrapper = mount(
        <MemoryRouter>
        <AddEventPopup />
        </MemoryRouter>
    )

    wrapper.find('AddEventPopup').instance().navigate = navigateStub
    })

    afterEach(() => {
        sinon.restore()
        wrapper.unmount()
    })

    it('alerts if you try to save with empty fields', () => {
        wrapper.find('button.save-button').simulate('click')
        expect(alertStub.calledOnce).to.be.true
        expect(alertStub.calledWith('Please fill in all fields.')).to.be.true
    })

    it('submits the form when fields are filled', async () => {

        wrapper.find('input#ename').simulate('change', { target: { value: 'My Event' } })
        wrapper.find('input#date').simulate('change', { target: { value: '2025-05-01' } })
        wrapper.find('input#time').simulate('change', { target: { value: '12:34' } })

        await wrapper.find('button.save-button').simulate('click')
        await Promise.resolve()

        expect(fetchStub.calledOnce).to.be.true
        const [url, opts] = fetchStub.firstCall.args
        expect(url).to.match(/\/api\/events$/)
        const body = JSON.parse(opts.body)
        expect(body).to.include({ title: 'My Event', date: '2025-05-01', time: '12:34' })
        expect(opts.method).to.equal('POST')

        expect(navigateStub.calledWith('/calendar')).to.be.true
    })
})
