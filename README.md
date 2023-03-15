# ShrekJS

ShrekJS is a JavaScript framework for building front-end applications. It was created as a joke but was accidentally made into an actually usable framework. It features reactive bindings, updatable sections, conditional rendering, and others.

# Disclaimer

This framework is a joke. It is not meant to be used in production. It is not meant to be used at all. If you are using this framework for production, there is something wrong with you. Better use Vue.js or React.

This framework will make you use a whole lot of function nesting, which is bad for the environment. It teaches some bad practices, such as using CDN for everything, writing large inline scripts, and using global variables.

However, if you still would like to try it out, you can find the documentation below.

# Table of Contents

- [Examples](#examples)
    - [Hello World](#hello-world)
    - [Nested Elements](#nested-elements)
    - [Counter](#counter)
    - [Conditional Rendering](#conditional-rendering)
    - [Updatable](#updatable)
    - [Reusable Component](#reusable-component)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Elements](#elements)
  - [Basic Elements](#basic-elements)
  - [Input Elements](#input-elements)
  - [Special Elements](#special-elements)
  - [Custom Elements](#custom-elements)
- [Bindings](#bindings)
  - [Reading-Writing Bindables](#reading-writing-bindables)
  - [Adding Observers](#adding-observers)
- [Components](#components)
    - [Creating Components](#creating-components)
    - [Using Components](#using-components)

# Examples

> All example assume that ShrekJS is installed through CDN.

## Hello World
```html
<script>
    put("Hello World!")
</script>
```

## Nested Elements
```html
<script>
    put(div([
        h(1, "Hi! This is a page heading"),
        tag("hr"),
        span([
            h(2, "This is a subheading"),
            p("This is a paragraph."),
            p("This is another paragraph.")
        ])
    ]))
</script>
```

## Counter
```html
<script>
    let count = new Bindable(0)
    put([
        span(["The counter is currently at ", count]),
        tag("br"),
        button("-", {}, () => count.value--),
        button("+", {}, () => count.value++)
    ])
</script>
```

## Conditional Rendering
```html
<script>
    let show = new Bindable(true)
    put([
        labeledInput("Toggle", "checkbox", {}, show),
        showIf(show, [
            h(1, "Hello World!"),
            p("This is a paragraph.")
        ])
    ])
</script>
```

## Updatable
```html
<script>
    list = new Bindable(['a', 'b', 'c'])
    put(updatable("for loop", () => {
        elements = []
        for (let letter of list.value) {
            elements.push([
                p(letter),
                button("Remove", {}, () => {
                    list.value = list.value.filter(l => l != letter)
                    update("for loop")
                    list.print()
                })
            ])
        }
        return elements
    }))
</script>

## Reusable Component

```js
// component.sh.js
makeComponent("myComponent", (args) => {
    return div([
        h1("My Component"),
        p(args.text)
    ])
})
```

```html
<!-- index.html -->
<script src="component.sh.js"></script>
<script>
    put(
        div([
            component("myComponent", {text: "Hello World!"})
        ])
    )
</script>
```

# Installation

ShrekJS is distributed as an npm package but only supported through CDN.

### CDN

Add the following line to the \<head> tag of your HTML file:

```html
<script src="https://unpkg.com/shrekjs-framework/shrek.js"></script>
```


# Getting Started

ShrekJS library consists of three parts: [elements](#elements), [bindings](#bindings), and [components](#components). Elements are the basic building blocks of ShrekJS. They are the HTML elements that are rendered on the page. Bindings are the reactive data that is used to update the elements. Components are reusable pieces of code that can be used to create more complex elements.

If you install the library through CDN, you can start writing ShrekJS code right away in an inline \<script> tag or in a separate .js file.

# Elements

Every element in ShrekJS is a function that returns an HTML element.

You can put any element on the page by calling the following function:

```js
put(slot)
```
`slot` - The content to be added to the root. Can be anything that will be a child of the root. For example, another element, a string, or a binding. If you would like to display multiple elements, you can pass an array of children of any type.

The default root element is the body element. You can change it with the following function:

```js
shrek.setRoot(id)
```

`id` - The id of the element to be used as the root. Must be a string.

## Basic Elements

ShrekJS comes with a few basic elements built-in:

```js
div(slot, arguments={})
span(slot, arguments={})
p(slot, arguments={})
h(num, slot, arguments={})
img(src, arguments={})
a(href, slot, inNewTab=false, arguments={})
```

They all create their respective HTML elements and return them.

Parameters:

`slot` - The content of the element. Can be anything that will be a child of the element. For example, another element, a string, or a binding. If you would like to nest multiple elements, you can pass an array of children of any type.

`arguments` - The attributes of the element. Can be anything that will be an attribute of the element. Must be an object.

`num` - The number of the header (e.g. 1 for h1). Must be a number.

`src` - The source of the image. Must be a string.

`href` - The link of the anchor. Must be a string.

`inNewTab` - Whether the link should open in a new tab. Must be a boolean. Defaults to false.

## Input Elements

You can also create inputs with included functions

```js
input(type, arguments={}, bindTo=undefined)
```

Creates an input element with the specified type. If `bindTo` is specified, the input value will be bound to the specified binding. `arguments` work the same as in the basic elements.

```js
labeledInput(labelText, type, arguments={}, bindTo=undefined)
```

Creates an input element of a specified type with a preceding label. If `bindTo` is specified, the input value will be bound to the specified binding. `arguments` only apply to the input element. However, if `id` attribute is given, its value will also be applied to the label's `for` attribute. Otherwise, generated automatically.

```js
button(slot, arguments={}, onclick=()=>{})
```

Creates a button element. If `onclick` is specified, it will be called when the button is clicked.
`arguments` and `slot` work the same as in the basic elements.

```js
button.link(slot, href, inNewTab=false, arguments={})
```

Creates a button element with an onclick function that redirects to the specified link.
`inNewTab`, `arguments`, and `slot` work the same as in the basic elements.

## Special Elements

ShrekJS also has a few special elements that are not standard HTML elements but are still useful.

```js
center(slot, arguments={})
```

Centers nested elements on the page. Does not center the text inside.
Creates a div element with `margin: auto` and `width: fit-content` in style.
`slot` and `arguments` work the same as in the basic elements.

```js
showIf(bindableCondition, slot)
```

Creates a div element that will only be rendered if the specified binding is truthy. Reacts to changes in the binding.
`slot` works the same as in the basic elements.

```js
updatable(name, slotFunction, initialArguments={})
```

Creates a div element that will be updated when the specified binding is updated. The contents of the element are determined by the `slotFunction` function. `initialArguments` are the arguments that will be passed to the `slotFunction` when the element is first rendered.
`name` specifies the internal name of the updatable block. It must be unique.

Updatable can be updated with the following command:

```js
update(name=undefined, arguments={})
```

If `name` is specified, the updatable block with the specified name will be updated. If `name` is not specified, all updatable blocks will be updated with given arguments.
`arguments` are the arguments that will be passed to the `slotFunction` when the element is updated.

```js
shrekPic()
```

## Custom Elements

If you would like to create an html element that is not included in ShrekJS, you can do so with the following function:

```js
tag(name, slot, arguments={})
```

Creates an element with the specified tag name.
`slot` and `arguments` work the same as in the basic elements.

# Bindings

Bindings are the reactive data connections that are used to update the elements on variable change and vice versa.
In ShrekJS they are saved as a data type `Bindable`.
They are created with the following constructor:

```js
let myBindable = new Bindable(value=undefined)
```

`value` is the initial value of the binding and is optional. It can be of any type and defaults to undefined.

## Reading-Writing Bindables

You can directly get and set the value of a binding with keyword `value`.

```js
myBindable.value
```

`value` exposes the value of the binding through a custom property that allows you to interact with it as if it was a normal variable while keeping the binding reactive.

```js
myBindable.value = 5
myBindable.value += 5
otherBindable.value = myBindable.value
```

For example, if you set a slot of some element to `myBindable`, the element will be updated when the value of `myBindable` changes.

The same goes for the other way around.
If you set an input's `bindTo` to `myBindable`, the value of `myBindable` will be updated when the input's value changes.

## Adding Observers

When you pass a Bindable to an element, the element generates an observer function that is saved into an observers list and is called when the value changes.
You can also add your own custom observers to a Bindable to add custom behavior when the value changes.
You can do so with the following method:

```js
myBindable.subscribe(observer)
```

`observer` is a function that will be called when the value of the binding changes. It takes the new value as a parameter.

To print the value of a binding, you can use the following method:

```js
myBindable.print()
```

# Components

Components are reusable pieces of code that can be used to create more complex elements on your webpage.

## Creating Components

Components are created with the following function:

```js
makeComponent(name, componentFunction)
```

`name` is the name of the component. It must be unique.
`componentFunction` is a function that returns an element. It takes the arguments of the component as parameters.

> It is highly recommended to create each component in its own .sh.js file and load it as a script to the main html file.

## Using Components

Components are used with the following function:

```js
component(name, arguments={})
```

`name` is the name of the component. It must be the same as the name of the component that you want to use.
`arguments` are the arguments that will be passed to the component function.
