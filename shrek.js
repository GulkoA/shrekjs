const shrek = {
    components: {},
    updatablesFunctions: {},
    version: '0.1',
    root: undefined,
    rootId: undefined,
    initialized: false
}

console.info('ShrekJS v' + shrek.version + ' loaded')

class Bindable {
    constructor(val=undefined) {
        this.originValue = val
        this.observers = []

        Object.defineProperty(this, 'value', {
            get: function() {
                // console.log('ShrekJS Bindable - value accessed')
                return this.originValue
            },
            set: function(newValue) {
                this.originValue = newValue
                // console.log('ShrekJS Bindable - value changed to ' + newValue)
                for (const observer of this.observers) {
                    observer(newValue)
                }
                return true
            }
        })
    }
    subscribe(observer) {
        this.observers.push(observer)
    }
    print() {
        console.log(this.value)
    }
}

shrek.initialize = function() {
    if (shrek.rootId) {
        shrek.root = document.getElementById(shrek.rootId)
    } else {
        shrek.root = document.body
    }
    shrek.initialized = true
}

shrek.setRoot = function(id) {
    shrek.rootId = id
}

function put(slot) {
    if(!shrek.initialized) {
        shrek.initialize()
    }

    addChild(shrek.root, slot)
}

function addChild(parent, slot) {
    if (slot !== undefined) {
        if (slot instanceof Array) {
            let children = []
            for (const child of slot) {
                children.push(addChild(parent, child))
            }
            return children
        }
        else if (slot instanceof HTMLElement) {
            parent.appendChild(slot)
            return slot
        }
        else if (slot instanceof Bindable) {
            let child = addChild(parent, slot.value)
            slot.subscribe((newValue) => {
                if (child !== undefined) {
                    removeElement(child)
                }
                child = addChild(parent, newValue)
            })
            return child
        } else {
            const text = document.createTextNode(slot)
            parent.appendChild(text)
            return text
        }
    }
}

function removeElement(element) {
    if (element instanceof Array) {
        for (const c of element) {
            removeElement(c)
        }
    } else {
        element.remove()
    }
}

function div(slot, arguments={}) {
    const div = document.createElement('div')
    for (const key in arguments) {
        div.setAttribute(key, arguments[key])
    }
    addChild(div, slot)
    return div
}

function text(slot) {
    return document.createTextNode(slot)
}

function h(num, slot, arguments={}) {
    const h = document.createElement('h' + num)
    for (const key in arguments) {
        h.setAttribute(key, arguments[key])
    }
    addChild(h, slot)
    return h
}

function img(src, arguments={}) {
    const img = document.createElement('img')
    img.setAttribute('src', src)
    for (const key in arguments) {
        img.setAttribute(key, arguments[key])
    }
    return img
}

function a(href, slot, inNewTab=false, arguments={}) {
    const a = document.createElement('a')
    a.setAttribute('href', href)
    if (inNewTab) a.setAttribute('target', '_blank')
    for (const key in arguments) {
        if (key === 'href') console.error('ShrekJS a() - Please use a function parameter to set the href attribute')
        a.setAttribute(key, arguments[key])
    }
    addChild(a, slot)
    return a
}

function p(slot, arguments={}) {
    const p = document.createElement('p')
    for (const key in arguments) {
        p.setAttribute(key, arguments[key])
    }
    addChild(p, slot)
    return p
}

function center(slot, arguments={}) {
    const div = document.createElement('div')
    for (const key in arguments) {
        div.setAttribute(key, arguments[key])
    }
    div.style += 'text-align: center margin: auto width: fit-content'
    addChild(div, slot)
    return div
}

function button(slot, onclick=()=>{}, arguments={}) {
    const button = document.createElement('button')
    button.onclick = onclick
    for (const key in arguments) {
        if (key === 'onclick') console.error('ShrekJS button() - Please use a function parameter to set the onclick attribute')
        button.setAttribute(key, arguments[key])
    }
    addChild(button, slot)
    return button
}

button.link = function(slot, href, inNewTab=false, arguments={}) {
    const button = document.createElement('button')
    if (inNewTab) {
        button.onclick = () => window.open(href)
    } else {
        button.onclick = () => window.location.href = href
    }

    for (const key in arguments) {
        if (key === 'onclick') console.error('ShrekJS button.link() - Please use a function parameter to set the onclick attribute')
        button.setAttribute(key, arguments[key])
    }
    addChild(button, slot)
    return button
}

function input(type, arguments={}, bindTo=undefined) {
    const input = document.createElement('input')
    input.setAttribute('type', type)

    for (const key in arguments) {
        input.setAttribute(key, arguments[key])
    }
    
    if (bindTo !== undefined) {
        if (!(bindTo instanceof Bindable)) {
            console.error('ShrekJS labeledInput() - bindTo must be a Bindable')
        }

        if (type === 'checkbox' || type === 'radio') {
            input.checked = bindTo.value
            input.onchange = () => bindTo.value = input.checked
            bindTo.subscribe((newValue) => input.checked = newValue)
        } else {
            input.value = bindTo.value !== undefined ? bindTo.value : ''
            input.oninput = () => bindTo.value = input.value
            bindTo.subscribe((newValue) => input.value = newValue)
        }
    }

    return input
}

function labeledInput(labelText, type, arguments={}, bindTo=undefined) {
    const label = document.createElement('label')
    label.textContent = labelText
    if (!arguments.hasOwnProperty('id')) {
        arguments.id = 'shrekjs-input-' + labelText.replace(' ', '_').toLowerCase()
    }
    label.setAttribute('for', arguments.id)

    const inputElement = input(type, arguments, bindTo)
    
    return [label, inputElement]
}

function span(slot, arguments={}) {
    const span = document.createElement('span')
    for (const key in arguments) {
        span.setAttribute(key, arguments[key])
    }
    addChild(span, slot)
    return span
}

function tag(name, slot, arguments={}) {
    const tag = document.createElement(name)
    for (const key in arguments) {
        tag.setAttribute(key, arguments[key])
    }
    addChild(tag, slot)
    return tag
}

function showIf(bindableCondition, slot) {
    if (!(bindableCondition instanceof Bindable)) {
        console.error('ShrekJS showIf() - bindableCondition must be a Bindable')
    }

    const div = document.createElement('div')
    div.style.display = bindableCondition.value ? 'block' : 'none'
    bindableCondition.subscribe((newValue) => div.style.display = newValue ? 'block' : 'none')
    addChild(div, slot)
    return div
}

function update(name=undefined, arguments={}) {
    if (name === undefined) {
        for (const key in shrek.updatables) {
            shrek.updatables[key]()
        }
    } else {
        if (shrek.updatablesFunctions[name]) {
            shrek.updatablesFunctions[name](arguments)
        } else {
            console.error('ShrekJS update() - Updatable "' + name + '" not found')
        }
    }
}

function updatable(name, slotFunction, initialArguments={}) {
    const div = document.createElement('div')
    shrek.updatablesFunctions[name] = (arguments) => {
        div.innerHTML = ''
        addChild(div, slotFunction(arguments))
    }
    shrek.updatablesFunctions[name](initialArguments)
    console.info('ShrekJS updatable() - Made updatable "' + name + '"')
    return div
}

function shrekPic() {
    return img('https://letsdraw.it/drawing/jn3dr1ip5.png')
}

function makeComponent(name, componentFunction) {
    shrek.components[name] = componentFunction
    console.info('ShrekJS makeComponent() - Made component "' + name + '"')
}

function component(name, arguments={}) {
    const comp = shrek.components[name]
    if (comp) {
        return comp(arguments)
    } else {
        console.error('ShrekJS component() - Component "' + name + '" not found')
    }
}