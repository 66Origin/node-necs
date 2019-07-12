## Classes

<dl>
<dt><a href="#AComponent">AComponent</a></dt>
<dd><p><code>AComponent</code> represent data or behaviors on an <code>Entity</code>. As an example, it can
represent a position (x,y), a hitbox or a texture.</p>
<p>The <code>A</code> in <code>AComponent</code> is for Abstract, it means you can not construct but you
must inherit it. A non-inherited <code>AComponent</code> represent nothing.</p>
<p>So on, you must inherit it, specify your datas and/or behaviour. You can
set your behaviors in the <code>update()</code> function or in public functions. You can
access the parent entity, you can access others components.</p>
<p>If your component require others components, you must check their presence
in the constructor and throw if they are missing. Remember, if you want to
follow this project design, you must fail-fast. It means you check every error-case
and throw as soon as possible. Better see sooner than undefined behaviors in production.</p>
<p>The <code>update()</code> function automatically called when your entity tree got its function
<code>update()</code> called.</p>
</dd>
<dt><a href="#ASystem">ASystem</a></dt>
<dd><p><code>ASystem</code> mean Abstract System. You must inherit this class to create systems.</p>
<p>A system is a &#39;module&#39; on which <code>update()</code> will run on each <code>update()</code> call from the world entity.
It perform predictable actions on a set of entities.</p>
<p>On inheriting ASystem, you must set a constructor which call <code>super()</code>. First argument is the parent which will be
given to your constructor. The second argument must be specified from your constructor. It must be an array with all
the components the system can work on.</p>
<p>When <code>update(entities)</code> is called, first argument is an array of entities, which comply to your components requirements.
All entities that have all the required components will be in the given array.</p>
<p>See examples to understand how systems work. Also take a look to <code>system_component.js</code> file. It is a component that
let you add systems to any entities.</p>
</dd>
<dt><a href="#Entity">Entity</a></dt>
<dd><p>An entity represent &#39;a thing&#39; into your world.</p>
<p>By default, a component is empty: no behaviour, no meaning in your world. You
can create and attach components. As an example, you can create an entity named
<code>wall</code> which have the following components: <code>Position</code>, <code>Hitbox</code>, <code>Sprite</code>.</p>
<p>See <code>acomponents.js</code> or the example folder for more details about components.</p>
<p>Notes:</p>
<ul>
<li>No tag system available yet as it may involve iterating all over the tree,
which may create bad performances. It may be added later with optimisations.</li>
</ul>
</dd>
<dt><a href="#SystemComponent">SystemComponent</a></dt>
<dd><p><code>SystemComponent</code> allow you to add systems to an entity. We recommend to add it
only to root entities to keep simple and predictable behaviours.</p>
<p>System are always executed in the order they are added: first added, first executed.</p>
<p>To create your own system, take a look a the file <code>asystem.js</code>.</p>
</dd>
</dl>

<a name="AComponent"></a>

## AComponent
`AComponent` represent data or behaviors on an `Entity`. As an example, it can
represent a position (x,y), a hitbox or a texture.

The `A` in `AComponent` is for Abstract, it means you can not construct but you
must inherit it. A non-inherited `AComponent` represent nothing.

So on, you must inherit it, specify your datas and/or behaviour. You can
set your behaviors in the `update()` function or in public functions. You can
access the parent entity, you can access others components.

If your component require others components, you must check their presence
in the constructor and throw if they are missing. Remember, if you want to
follow this project design, you must fail-fast. It means you check every error-case
and throw as soon as possible. Better see sooner than undefined behaviors in production.

The `update()` function automatically called when your entity tree got its function
`update()` called.

**Kind**: global class  

* [AComponent](#AComponent)
    * [new AComponent(parent)](#new_AComponent_new)
    * _instance_
        * [.parent](#AComponent+parent) ⇒ [<code>Entity</code>](#Entity)
        * [.identity](#AComponent+identity) ⇒ <code>String</code>
        * [.destructor()](#AComponent+destructor)
        * [.update()](#AComponent+update)
    * _static_
        * [.identity](#AComponent.identity) ⇒ <code>String</code>

<a name="new_AComponent_new"></a>

### new AComponent(parent)
On inheritting `AComponent`, `parentEntity` will be passed to your constructor among
your own arguments. You must keep `parentEntity` first, then your arguments.


| Param | Type | Description |
| --- | --- | --- |
| parent | [<code>Entity</code>](#Entity) | The entity which own this component |

<a name="AComponent+parent"></a>

### aComponent.parent ⇒ [<code>Entity</code>](#Entity)
**Kind**: instance property of [<code>AComponent</code>](#AComponent)  
**Returns**: [<code>Entity</code>](#Entity) - Owner of this component.  
<a name="AComponent+identity"></a>

### aComponent.identity ⇒ <code>String</code>
On inheriting AComponent, you must override this function to return the
component name from your class static function name. See below for
more informations.

**Kind**: instance property of [<code>AComponent</code>](#AComponent)  
<a name="AComponent+destructor"></a>

### aComponent.destructor()
This function will be called on destruction.

You can do some cleanup if needed.

**Kind**: instance method of [<code>AComponent</code>](#AComponent)  
<a name="AComponent+update"></a>

### aComponent.update()
This function will be called on each new frame. You must override it to
specify your own behaviors.

**Kind**: instance method of [<code>AComponent</code>](#AComponent)  
<a name="AComponent.identity"></a>

### AComponent.identity ⇒ <code>String</code>
On inheriting AComponent, you must override this function to return the component name.

The component name will be the easy-access key on your entity. If you set
`position`, you will be able to access the component using `entity.position`.

It should be unique.

See above for the instance version of this function.

**Kind**: static property of [<code>AComponent</code>](#AComponent)  
<a name="ASystem"></a>

## ASystem
`ASystem` mean Abstract System. You must inherit this class to create systems.

A system is a 'module' on which `update()` will run on each `update()` call from the world entity.
It perform predictable actions on a set of entities.

On inheriting ASystem, you must set a constructor which call `super()`. First argument is the parent which will be
given to your constructor. The second argument must be specified from your constructor. It must be an array with all
the components the system can work on.

When `update(entities)` is called, first argument is an array of entities, which comply to your components requirements.
All entities that have all the required components will be in the given array.

See examples to understand how systems work. Also take a look to `system_component.js` file. It is a component that
let you add systems to any entities.

**Kind**: global class  

* [ASystem](#ASystem)
    * [new ASystem(parent, requiredComponents)](#new_ASystem_new)
    * [.update(entities)](#ASystem+update)

<a name="new_ASystem_new"></a>

### new ASystem(parent, requiredComponents)
On inheriting `ASystem`, parent will be given to your constructor as first argument. You just have to pass
`parent` to `super()`.

`requiredComponents` must be specified by yourself: all the components you want in the entities that will be passed
to `update()`.


| Param | Type | Description |
| --- | --- | --- |
| parent | [<code>Entity</code>](#Entity) | The entity which own the system. |
| requiredComponents | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | Components that are required for the entities passed to your update function. |

<a name="ASystem+update"></a>

### aSystem.update(entities)
This function will be called on each `update()` call from the parent entity or an entity which own the parent.

You must override this function, it is all the behaviors of your system.

**Kind**: instance method of [<code>ASystem</code>](#ASystem)  

| Param | Type | Description |
| --- | --- | --- |
| entities | [<code>Array.&lt;Entity&gt;</code>](#Entity) | All entities available in the tree which comply to the required components. |

<a name="Entity"></a>

## Entity
An entity represent 'a thing' into your world.

By default, a component is empty: no behaviour, no meaning in your world. You
can create and attach components. As an example, you can create an entity named
`wall` which have the following components: `Position`, `Hitbox`, `Sprite`.

See `acomponents.js` or the example folder for more details about components.

Notes:
- No tag system available yet as it may involve iterating all over the tree,
which may create bad performances. It may be added later with optimisations.

**Kind**: global class  

* [Entity](#Entity)
    * [new Entity(parent, ComponentsType)](#new_Entity_new)
    * _instance_
        * [.parent](#Entity+parent) ⇒ [<code>Entity</code>](#Entity)
        * [.name](#Entity+name) ⇒ <code>String</code>
        * [._destructor()](#Entity+_destructor)
        * [.createChild(name, ComponentsType)](#Entity+createChild) ⇒ [<code>Entity</code>](#Entity)
        * [.update()](#Entity+update)
        * [._(name)](#Entity+_) ⇒ [<code>Entity</code>](#Entity)
        * [.getChild(name)](#Entity+getChild) ⇒ [<code>Entity</code>](#Entity)
        * [.deleteChild(name)](#Entity+deleteChild)
        * [.deleteThis()](#Entity+deleteThis)
        * [.has(ComponentsType)](#Entity+has) ⇒ <code>Boolean</code>
        * [.get(ComponentType)](#Entity+get)
        * [.add(ComponentType, ...args)](#Entity+add)
        * [.addMany(ComponentsType)](#Entity+addMany)
        * [.delete(ComponentType)](#Entity+delete)
        * [.deleteMany(ComponentsType)](#Entity+deleteMany)
    * _static_
        * [.createWorld(ComponentsType)](#Entity.createWorld) ⇒ [<code>Entity</code>](#Entity)

<a name="new_Entity_new"></a>

### new Entity(parent, ComponentsType)
Create a new entity.
You must NOT use this function: use `static createWorld()` or `createChild()`.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| parent | [<code>Entity</code>](#Entity) |  | The parent of this new entity. `null` mean it is a 'world' entity |
| ComponentsType | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | <code></code> | Components to insert to the new entity. These components must be default-constructible. |

<a name="Entity+parent"></a>

### entity.parent ⇒ [<code>Entity</code>](#Entity)
Get the entity which own this entity.

If this entity represent the world, it will return `null`.

**Kind**: instance property of [<code>Entity</code>](#Entity)  
**Returns**: [<code>Entity</code>](#Entity) - Owner of this entity.  
<a name="Entity+name"></a>

### entity.name ⇒ <code>String</code>
Get the name of this entity. All entities have a name excepted root entities wich have no parent as a world.

**Kind**: instance property of [<code>Entity</code>](#Entity)  
**Returns**: <code>String</code> - Name of this entity  
<a name="Entity+_destructor"></a>

### entity.\_destructor()
This function is automatically called on destruction. It will call
`destructor()` on every components. Do not use an entity after this
function being called.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
<a name="Entity+createChild"></a>

### entity.createChild(name, ComponentsType) ⇒ [<code>Entity</code>](#Entity)
Create an entity which will be child of this entity.

**Kind**: instance method of [<code>Entity</code>](#Entity)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>String</code> |  | Name of the child. You can later get the child using `_()` or `getChild()` functions. |
| ComponentsType | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | <code></code> | Components to insert to the new entity. These components must be default-constructible. |

<a name="Entity+update"></a>

### entity.update()
Update all childs then our own components. This will call `update()` on
all child entities and on all components from this entity and childs.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
<a name="Entity+_"></a>

### entity.\_(name) ⇒ [<code>Entity</code>](#Entity)
Get a child of this entity.

This function is just an alias for quick-access of `getChild(name)`.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: [<code>Entity</code>](#Entity) - The child or null if it does not exist.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Child name you want to get |

<a name="Entity+getChild"></a>

### entity.getChild(name) ⇒ [<code>Entity</code>](#Entity)
Get a child of this entity.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: [<code>Entity</code>](#Entity) - The child or null if it does not exist.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Child name you want to get |

<a name="Entity+deleteChild"></a>

### entity.deleteChild(name)
Delete a child. An error will be thrown if child is not found.

**Kind**: instance method of [<code>Entity</code>](#Entity)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Child name you want to get |

<a name="Entity+deleteThis"></a>

### entity.deleteThis()
Delete this entity. It must be a child of another entity, else an error will
be thrown.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
<a name="Entity+has"></a>

### entity.has(ComponentsType) ⇒ <code>Boolean</code>
Know if components are present on this entity.
If not components are given, it will return `true`.

This function will also return `true` if you give a super class of an installed component.
You can by example have `ADrawableComponent` which is abstract and many implementations: `SpriteComponent`,
`TextComponent`, ...

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: <code>Boolean</code> - `true` if all components are present  

| Param | Type | Description |
| --- | --- | --- |
| ComponentsType | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | Components that may exist on this entity |

<a name="Entity+get"></a>

### entity.get(ComponentType)
Get a specific component from this entity.

You can pass a sub-class of your component, it will return it.

**Kind**: instance method of [<code>Entity</code>](#Entity)  

| Param | Type | Description |
| --- | --- | --- |
| ComponentType | [<code>AComponent</code>](#AComponent) | Type of your component or a subclass to get. `null` if not found. |

<a name="Entity+add"></a>

### entity.add(ComponentType, ...args)
Add a component to this entity.

**Kind**: instance method of [<code>Entity</code>](#Entity)  

| Param | Type | Description |
| --- | --- | --- |
| ComponentType | [<code>AComponent</code>](#AComponent) | The type of the component to add |
| ...args | <code>any</code> | Arguments to pass to the component constructor |

<a name="Entity+addMany"></a>

### entity.addMany(ComponentsType)
Add many components to this entity. Each component must be default-constructible.

**Kind**: instance method of [<code>Entity</code>](#Entity)  

| Param | Type | Description |
| --- | --- | --- |
| ComponentsType | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | Type of the components to add |

<a name="Entity+delete"></a>

### entity.delete(ComponentType)
Delete a specific component from this entity. If the Component is not
found, an error will be thrown.

**Kind**: instance method of [<code>Entity</code>](#Entity)  

| Param | Type | Description |
| --- | --- | --- |
| ComponentType | [<code>AComponent</code>](#AComponent) | Type of the component to delete |

<a name="Entity+deleteMany"></a>

### entity.deleteMany(ComponentsType)
Delete specific components from this entity. If a component is not found,
an error will be thrown.

**Kind**: instance method of [<code>Entity</code>](#Entity)  

| Param | Type | Description |
| --- | --- | --- |
| ComponentsType | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | Type of the components to delete |

<a name="Entity.createWorld"></a>

### Entity.createWorld(ComponentsType) ⇒ [<code>Entity</code>](#Entity)
Create an entity which have no parent: it will represent a world. It will
be the 'root', and will have many childs.

**Kind**: static method of [<code>Entity</code>](#Entity)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| ComponentsType | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | <code></code> | Components to insert to the new entity. These components must be default-constructible. |

<a name="SystemComponent"></a>

## SystemComponent
`SystemComponent` allow you to add systems to an entity. We recommend to add it
only to root entities to keep simple and predictable behaviours.

System are always executed in the order they are added: first added, first executed.

To create your own system, take a look a the file `asystem.js`.

**Kind**: global class  

* [SystemComponent](#SystemComponent)
    * [.add(SystemType, ...args)](#SystemComponent+add)
    * [.delete(SystemType)](#SystemComponent+delete)
    * [.update()](#SystemComponent+update)

<a name="SystemComponent+add"></a>

### systemComponent.add(SystemType, ...args)
Add a system.

System are always executed in the order they are added: first added, first executed.

See ASystem documentation for more informations.

**Kind**: instance method of [<code>SystemComponent</code>](#SystemComponent)  

| Param | Type | Description |
| --- | --- | --- |
| SystemType | [<code>ASystem</code>](#ASystem) | System to add. |
| ...args | <code>\*</code> | Arguments to pass to system constructor |

<a name="SystemComponent+delete"></a>

### systemComponent.delete(SystemType)
Delete a system. If system is not found, an error will be thrown.

**Kind**: instance method of [<code>SystemComponent</code>](#SystemComponent)  

| Param | Type | Description |
| --- | --- | --- |
| SystemType | [<code>ASystem</code>](#ASystem) | System to remove. |

<a name="SystemComponent+update"></a>

### systemComponent.update()
Call the `update()` function on all registered systems with the complying entities.

**Kind**: instance method of [<code>SystemComponent</code>](#SystemComponent)  
