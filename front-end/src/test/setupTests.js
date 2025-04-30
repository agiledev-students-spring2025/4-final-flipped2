import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import jsdom from 'jsdom'
import sinon from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

const { JSDOM } = jsdom
const doc = new JSDOM('<!doctype html><html><body></body></html>')
global.window = doc.window
global.document = doc.window.document
global.navigator = { userAgent: 'node.js' }

global.fetch = require('node-fetch')