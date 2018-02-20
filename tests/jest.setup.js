import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import delay from 'delay'

Enzyme.configure({ adapter: new Adapter() })

global.snapshot = async function(Root, mutation) {
    const tree = mount(Root)
    expect(tree).toMatchSnapshot()
    if (mutation) {
        mutation(tree)
        await delay(30)
        tree.update()
        expect(tree).toMatchSnapshot()
    }
}