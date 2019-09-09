## Classes

<dl>
<dt><a href="#AComponent">AComponent</a></dt>
<dd><p><code>AComponent</code> represent data or behaviors on an <code>Entity</code>. As an example, it can
represent a position (x,y), a hitbox or a texture.</p>
<p>The <code>A</code> in <code>AComponent</code> is for Abstract, it means you can not construct but you
must inherit it. A non-inherited <code>AComponent</code> represent nothing.</p>
<p>So on, you must inherit it, specify your datas and/or behaviours. You can
set your behaviours in the <code>update()</code> function or in public functions. You can
access the parent entity, and others components.</p>
<p>If your component require others components, you must check their existence
in the constructor and throw if they are missing. Remember, if you want to
follow this project design, you must fail-fast. It means you check every error-case
and throw as soon as possible. Better see sooner than unreproducible undefined behaviors in production.</p>
<p>The <code>update()</code> function is automatically called when your entity tree got its function
<code>update()</code> called.</p>
</dd>
<dt><a href="#ASystem">ASystem</a></dt>
<dd><p><code>ASystem</code> mean Abstract System. You can create systems by inheriting this class.</p>
<p>A system is a &#39;module&#39; on which <code>ASystem.earlyUpdate()</code> and <code>ASystem.lateUpdate()</code> will run on each <code>Entity.update()</code>
call from the world entity.
It perform predictable actions on a set of entities.</p>
<p>On inheriting ASystem, you must set a constructor which call <code>super()</code>. First argument is the parent which will be
given to your constructor. The second argument must be specified from your constructor: it must be an array with all
the components the system can work on.</p>
<p>You must implement <code>earlyUpdate(entities)</code> and/or <code>lateUpdate(entities)</code>.
First argument is an array of entities, which comply to your components requirements.
All entities that have all the required components will be in the given array.</p>
<p>See examples to understand how systems work.</p>
<p>To create systems, you must add <code>SystemComponent</code> to your world entity.</p>
</dd>
<dt><a href="#Entity">Entity</a></dt>
<dd><p>An entity represent &#39;a thing&#39; into your world.</p>
<p>By default, an entity is empty: no behaviours, no meaning, no purpose.</p>
<ul>
<li>You can attach components. As an example, you can create an entity named
<code>wall</code> which have the following components: <code>Position</code>, <code>Hitbox</code>, <code>Sprite</code>.</li>
<li>You can create child entities.</li>
</ul>
<p>On updating an entity, this procedure apply:</p>
<ul>
<li>Emit <code>nextEarlyUpdate</code></li>
<li>Call <code>earlyUpdate()</code> on child entities (which call <code>earlyUpdate()</code> on child entities then components)</li>
<li>Call <code>earlyUpdate()</code> on entity&#39;s components</li>
<li>Emit <code>nextLateUpdate</code></li>
<li>Call <code>lateUpdate()</code> on child entities (which call <code>lateUpdate()</code> on child entities then components)</li>
<li>Call <code>lateUpdate()</code> on entity&#39;s components</li>
</ul>
<p>On adding components to an entity, the order they are added matter: first added, first to be updated. Last added,
last to be updated.</p>
<p><code>nextEarlyUpdate</code> and <code>nextLateUpdate</code> may be useful if you do something <code>now</code> and you want to do something at <code>now+1</code>.</p>
<p>It may be useful if you have a drawing system:</p>
<ul>
<li>On your world, a component is drawing sprites on screen</li>
<li>Childs of your world are sprites.</li>
<li>First, sprites get <code>earlyUpdate()</code> called</li>
<li>Then, drawing system get <code>earlyUpdate()</code> called</li>
<li>Finally, sprites get <code>lateUpdate()</code> called</li>
</ul>
</dd>
<dt><a href="#SystemComponent">SystemComponent</a></dt>
<dd><p><code>SystemComponent</code> is a component which allow you to add systems to an entity. We recommend to add it
only to world entities to keep simple and predictable behaviours.</p>
<p>System are always executed in the order they are added: first added, first updated.</p>
<p>To create your own system, take a look a the file <code>asystem.js</code>.</p>
</dd>
</dl>

<a name="AComponent"></a>

## AComponent
`AComponent` represent data or behaviors on an `Entity`. As an example, it can
represent a position (x,y), a hitbox or a texture.

The `A` in `AComponent` is for Abstract, it means you can not construct but you
must inherit it. A non-inherited `AComponent` represent nothing.

So on, you must inherit it, specify your datas and/or behaviours. You can
set your behaviours in the `update()` function or in public functions. You can
access the parent entity, and others components.

If your component require others components, you must check their existence
in the constructor and throw if they are missing. Remember, if you want to
follow this project design, you must fail-fast. It means you check every error-case
and throw as soon as possible. Better see sooner than unreproducible undefined behaviors in production.

The `update()` function is automatically called when your entity tree got its function
`update()` called.

**Kind**: global class  

* [AComponent](#AComponent)
    * [new AComponent(parent)](#new_AComponent_new)
    * _instance_
        * [.parent](#AComponent+parent) ⇒ [<code>Entity</code>](#Entity)
        * [.identity](#AComponent+identity) ⇒ <code>String</code>
        * [.emit(name, [payload])](#AComponent+emit)
        * [.earlyUpdate()](#AComponent+earlyUpdate)
        * [.lateUpdate()](#AComponent+lateUpdate)
        * [.destructor()](#AComponent+destructor)
    * _static_
        * [.identity](#AComponent.identity) ⇒ <code>String</code>

<a name="new_AComponent_new"></a>

### new AComponent(parent)
On inheriting `AComponent`, `parent` will be passed to your constructor among
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
component name from your class static function name.

See static function `AComponent.identity`.

**Kind**: instance property of [<code>AComponent</code>](#AComponent)  
<a name="AComponent+emit"></a>

### aComponent.emit(name, [payload])
Emit an event from parent identified as this component.

This function works as a regular EventEmitter. Only differences are:
- Event will be emitted from the parent entity
- Event name will be `identity:name` (ex: 'sprite:visible')

So on, it is a shortcut to `this.parent.emit(this.identity + ':' + name, payload)`.

**Kind**: instance method of [<code>AComponent</code>](#AComponent)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>String</code> |  | Name of this event. |
| [payload] | <code>\*</code> | <code></code> | Optional payload to pass to the event. |

<a name="AComponent+earlyUpdate"></a>

### aComponent.earlyUpdate()
Early update of this component. See `Entity` documentation for more information.

**Kind**: instance method of [<code>AComponent</code>](#AComponent)  
<a name="AComponent+lateUpdate"></a>

### aComponent.lateUpdate()
Late update of this component. See `Entity` documentation for more information.

**Kind**: instance method of [<code>AComponent</code>](#AComponent)  
<a name="AComponent+destructor"></a>

### aComponent.destructor()
This function will be called on destruction.

You can do some cleanup if needed.

**Kind**: instance method of [<code>AComponent</code>](#AComponent)  
<a name="AComponent.identity"></a>

### AComponent.identity ⇒ <code>String</code>
On inheriting AComponent, you must override this function to return the component name.

The component name will be the easy-access key on your entity. If you set
`position`, you will be able to access the component using `entity.position`.

It must be unique.

See the instance function `AComponent.identity`.

**Kind**: static property of [<code>AComponent</code>](#AComponent)  
<a name="ASystem"></a>

## ASystem
`ASystem` mean Abstract System. You can create systems by inheriting this class.

A system is a 'module' on which `ASystem.earlyUpdate()` and `ASystem.lateUpdate()` will run on each `Entity.update()`
call from the world entity.
It perform predictable actions on a set of entities.

On inheriting ASystem, you must set a constructor which call `super()`. First argument is the parent which will be
given to your constructor. The second argument must be specified from your constructor: it must be an array with all
the components the system can work on.

You must implement `earlyUpdate(entities)` and/or `lateUpdate(entities)`.
First argument is an array of entities, which comply to your components requirements.
All entities that have all the required components will be in the given array.

See examples to understand how systems work.

To create systems, you must add `SystemComponent` to your world entity.

**Kind**: global class  

* [ASystem](#ASystem)
    * [new ASystem(parent, requiredComponents)](#new_ASystem_new)
    * [.parent](#ASystem+parent) ⇒ [<code>Entity</code>](#Entity)
    * [.requiredComponents](#ASystem+requiredComponents) ⇒ [<code>Array.&lt;AComponent&gt;</code>](#AComponent)

<a name="new_ASystem_new"></a>

### new ASystem(parent, requiredComponents)
On inheriting `ASystem`, `parent` will be given to your constructor as first argument. You just have to pass
`parent` to `super()`.

`requiredComponents` must be specified by yourself: all the components you want in the entities that will be passed
to `update()`. It is an entity filter by components.


| Param | Type | Description |
| --- | --- | --- |
| parent | [<code>Entity</code>](#Entity) | The entity which own the system. |
| requiredComponents | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | Components filter to get complying entities which will be given to `update()` function. |

<a name="ASystem+parent"></a>

### aSystem.parent ⇒ [<code>Entity</code>](#Entity)
**Kind**: instance property of [<code>ASystem</code>](#ASystem)  
**Returns**: [<code>Entity</code>](#Entity) - The Entity which own this system.  
<a name="ASystem+requiredComponents"></a>

### aSystem.requiredComponents ⇒ [<code>Array.&lt;AComponent&gt;</code>](#AComponent)
**Kind**: instance property of [<code>ASystem</code>](#ASystem)  
**Returns**: [<code>Array.&lt;AComponent&gt;</code>](#AComponent) - The components which will filter entities to be given to `update()`.  
<a name="Entity"></a>

## Entity
An entity represent 'a thing' into your world.

By default, an entity is empty: no behaviours, no meaning, no purpose.

- You can attach components. As an example, you can create an entity named
`wall` which have the following components: `Position`, `Hitbox`, `Sprite`.
- You can create child entities.

On updating an entity, this procedure apply:
- Emit `nextEarlyUpdate`
- Call `earlyUpdate()` on child entities (which call `earlyUpdate()` on child entities then components)
- Call `earlyUpdate()` on entity's components
- Emit `nextLateUpdate`
- Call `lateUpdate()` on child entities (which call `lateUpdate()` on child entities then components)
- Call `lateUpdate()` on entity's components

On adding components to an entity, the order they are added matter: first added, first to be updated. Last added,
last to be updated.

`nextEarlyUpdate` and `nextLateUpdate` may be useful if you do something `now` and you want to do something at `now+1`.

It may be useful if you have a drawing system:
- On your world, a component is drawing sprites on screen
- Childs of your world are sprites.
- First, sprites get `earlyUpdate()` called
- Then, drawing system get `earlyUpdate()` called
- Finally, sprites get `lateUpdate()` called

**Kind**: global class  

* [Entity](#Entity)
    * [new Entity([parent], [ComponentsType])](#new_Entity_new)
    * _instance_
        * [.childs](#Entity+childs) ⇒ <code>Object</code>
        * [.parent](#Entity+parent) ⇒ [<code>Entity</code>](#Entity)
        * [.name](#Entity+name) ⇒ <code>String</code>
        * [.update()](#Entity+update)
        * [._(name)](#Entity+_) ⇒ [<code>Entity</code>](#Entity)
        * [.getChild(name)](#Entity+getChild) ⇒ [<code>Entity</code>](#Entity)
        * [.createChild(name, [ComponentsType])](#Entity+createChild) ⇒ [<code>Entity</code>](#Entity)
        * [.deleteChild(name)](#Entity+deleteChild)
        * [.deleteChildIfExist(name)](#Entity+deleteChildIfExist)
        * [.deleteChilds()](#Entity+deleteChilds)
        * [.deleteThis()](#Entity+deleteThis)
        * [.has(ComponentsType)](#Entity+has) ⇒ <code>Boolean</code>
        * [.get([ComponentType])](#Entity+get) ⇒ [<code>AComponent</code>](#AComponent)
        * [.add(ComponentType, ...args)](#Entity+add) ⇒ [<code>Entity</code>](#Entity)
        * [.addMany(ComponentsType)](#Entity+addMany) ⇒ [<code>Entity</code>](#Entity)
        * [.delete(ComponentType)](#Entity+delete) ⇒ [<code>Entity</code>](#Entity)
        * [.deleteIfExist(ComponentType)](#Entity+deleteIfExist) ⇒ [<code>Entity</code>](#Entity)
        * [.deleteMany(ComponentsType)](#Entity+deleteMany) ⇒ [<code>Entity</code>](#Entity)
        * [.deleteManyIfExist(ComponentsType)](#Entity+deleteManyIfExist) ⇒ [<code>Entity</code>](#Entity)
    * _static_
        * [.createWorld([ComponentsType])](#Entity.createWorld) ⇒ [<code>Entity</code>](#Entity)

<a name="new_Entity_new"></a>

### new Entity([parent], [ComponentsType])
Create a new entity.

You must **NOT** use this function: use `static createWorld()` or `createChild()`.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [parent] | [<code>Entity</code>](#Entity) |  | The parent of this new entity. `null` mean it is a 'world' entity |
| [ComponentsType] | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | <code></code> | Components to insert to the new entity. These components must be default-constructible. |

<a name="Entity+childs"></a>

### entity.childs ⇒ <code>Object</code>
Get all childs of this entity. The returned object is a copy of the internal representation and is frozen.

So on, it is read-only.

The returned object won't be kept up to date with later adding or deleting.

**Kind**: instance property of [<code>Entity</code>](#Entity)  
**Returns**: <code>Object</code> - An object with child name as key and child as value  
<a name="Entity+parent"></a>

### entity.parent ⇒ [<code>Entity</code>](#Entity)
Get the entity which own this entity.

If this entity represent the world, it will return `null`.

**Kind**: instance property of [<code>Entity</code>](#Entity)  
**Returns**: [<code>Entity</code>](#Entity) - Owner of this entity.  
<a name="Entity+name"></a>

### entity.name ⇒ <code>String</code>
Get the name of this entity. All entities have a name excepted world entities which have no parent.

**Kind**: instance property of [<code>Entity</code>](#Entity)  
**Returns**: <code>String</code> - Name of this entity  
<a name="Entity+update"></a>

### entity.update()
Call `earlyUpdate()` then `lateUpdate()`. See documentation of Entity for more information about
the `update()`.

You should call this function only on your world Entity.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
<a name="Entity+_"></a>

### entity.\_(name) ⇒ [<code>Entity</code>](#Entity)
Get a child of this entity.

This function is just an alias for quick-access of `getChild(name)`. See that function for more documentation.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: [<code>Entity</code>](#Entity) - The child or null if it does not exist.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Child name you want to get |

<a name="Entity+getChild"></a>

### entity.getChild(name) ⇒ [<code>Entity</code>](#Entity)
Get a child of this entity.

You can get childs recursively by using points `.` as delimiter in your name. Example: `world.getChild('player.body.arm')`
will retrieve `arm` entity which is a child of `body` entity which is a child of `player` entity which is a child of `world`.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: [<code>Entity</code>](#Entity) - The child or null if it does not exist.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Child name you want to get |

<a name="Entity+createChild"></a>

### entity.createChild(name, [ComponentsType]) ⇒ [<code>Entity</code>](#Entity)
Create an entity which will be child of this entity.

`name` must not contain points `.` : they are used as delemiter to get child of child.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: [<code>Entity</code>](#Entity) - the created entity  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>String</code> |  | Name of the child. You can later get the child using `_()` or `getChild()` functions. |
| [ComponentsType] | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | <code></code> | Components to add to the new entity. These components must be default-constructible. |

<a name="Entity+deleteChild"></a>

### entity.deleteChild(name)
Delete a child. An error will be thrown if child is not found.

**Kind**: instance method of [<code>Entity</code>](#Entity)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Child name you want to delete |

<a name="Entity+deleteChildIfExist"></a>

### entity.deleteChildIfExist(name)
Delete a child if it exist. Does the same thing as `deleteChild` except it won't throw if the child does not
exist.

**Kind**: instance method of [<code>Entity</code>](#Entity)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Child name you want to delete |

<a name="Entity+deleteChilds"></a>

### entity.deleteChilds()
Delete all childs:

- Call `_destructor()` on each child and delete them from this entity.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
<a name="Entity+deleteThis"></a>

### entity.deleteThis()
Delete this entity and remove all listeners from this entity.

It must be have a parent, else an error will be thrown.

It will also delete all childs of this entity.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
<a name="Entity+has"></a>

### entity.has(ComponentsType) ⇒ <code>Boolean</code>
Know if components are present on this entity.
If not components are given, it will return `true`.

This function will also return `true` if you give a super class of an installed component.
You can by example have `ADrawableComponent` which is inherited by `SpriteComponent`,
`TextComponent`, ...

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: <code>Boolean</code> - `true` if all components are present  

| Param | Type | Description |
| --- | --- | --- |
| ComponentsType | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | Components that may exist on this entity |

<a name="Entity+get"></a>

### entity.get([ComponentType]) ⇒ [<code>AComponent</code>](#AComponent)
Get a specific component from this entity.

If you pass a super class of your component, it will return it.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: [<code>AComponent</code>](#AComponent) - Return the requested component instance or null.  

| Param | Type | Description |
| --- | --- | --- |
| [ComponentType] | [<code>AComponent</code>](#AComponent) | Type of your component or a subclass to get. `null` if not found. |

<a name="Entity+add"></a>

### entity.add(ComponentType, ...args) ⇒ [<code>Entity</code>](#Entity)
Add a component to this entity on last position.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: [<code>Entity</code>](#Entity) - this entity (useful for chaining)  

| Param | Type | Description |
| --- | --- | --- |
| ComponentType | [<code>AComponent</code>](#AComponent) | The type of the component to add |
| ...args | <code>\*</code> | Arguments to pass to the component constructor |

<a name="Entity+addMany"></a>

### entity.addMany(ComponentsType) ⇒ [<code>Entity</code>](#Entity)
Add many components to this entity in the same order they are given at last position.

Each component must be default-constructible.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: [<code>Entity</code>](#Entity) - this entity (useful for chaining)  

| Param | Type | Description |
| --- | --- | --- |
| ComponentsType | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | Types of the components to add |

<a name="Entity+delete"></a>

### entity.delete(ComponentType) ⇒ [<code>Entity</code>](#Entity)
Delete a specific component from this entity. If the Component is not
found, an error will be thrown.

A common mistake is to delete components, but forget to delete its listeners. It may cause memory leaks and bugs
if you insert back the component later.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: [<code>Entity</code>](#Entity) - this entity (useful for chaining)  

| Param | Type | Description |
| --- | --- | --- |
| ComponentType | [<code>AComponent</code>](#AComponent) | Type of the component to delete |

<a name="Entity+deleteIfExist"></a>

### entity.deleteIfExist(ComponentType) ⇒ [<code>Entity</code>](#Entity)
Delete a specific component from this entity. If the Component is not
found, no error will be thrown.

A common mistake is to delete components, but forget to delete its listeners. It may cause memory leaks and bugs
if you insert back the component later.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: [<code>Entity</code>](#Entity) - this entity (useful for chaining)  

| Param | Type | Description |
| --- | --- | --- |
| ComponentType | [<code>AComponent</code>](#AComponent) | Type of the component to delete |

<a name="Entity+deleteMany"></a>

### entity.deleteMany(ComponentsType) ⇒ [<code>Entity</code>](#Entity)
Delete specific components from this entity. If a component is not found,
an error will be thrown.

A common mistake is to delete components, but forget to delete its listeners. It may cause memory leaks and bugs
if you insert back the component later.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: [<code>Entity</code>](#Entity) - this entity (useful for chaining)  

| Param | Type | Description |
| --- | --- | --- |
| ComponentsType | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | Type of the components to delete |

<a name="Entity+deleteManyIfExist"></a>

### entity.deleteManyIfExist(ComponentsType) ⇒ [<code>Entity</code>](#Entity)
Delete specific components from this entity. If a component is not found,
no error will be thrown and no component will be deleted.

A common mistake is to delete components, but forget to delete its listeners. It may cause memory leaks and bugs
if you insert back the component later.

**Kind**: instance method of [<code>Entity</code>](#Entity)  
**Returns**: [<code>Entity</code>](#Entity) - this entity (useful for chaining)  

| Param | Type | Description |
| --- | --- | --- |
| ComponentsType | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | Type of the components to delete |

<a name="Entity.createWorld"></a>

### Entity.createWorld([ComponentsType]) ⇒ [<code>Entity</code>](#Entity)
Create an entity which have no parent: it will represent a world. It will
be the 'root', and will have many childs.

**Kind**: static method of [<code>Entity</code>](#Entity)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [ComponentsType] | [<code>Array.&lt;AComponent&gt;</code>](#AComponent) | <code></code> | Components to insert to the new entity. These components must be default-constructible. |

<a name="SystemComponent"></a>

## SystemComponent
`SystemComponent` is a component which allow you to add systems to an entity. We recommend to add it
only to world entities to keep simple and predictable behaviours.

System are always executed in the order they are added: first added, first updated.

To create your own system, take a look a the file `asystem.js`.

**Kind**: global class  

* [SystemComponent](#SystemComponent)
    * [.add(SystemType, ...args)](#SystemComponent+add)
    * [.delete(SystemType)](#SystemComponent+delete)
    * [.earlyUpdate()](#SystemComponent+earlyUpdate)
    * [.lateUpdate()](#SystemComponent+lateUpdate)

<a name="SystemComponent+add"></a>

### systemComponent.add(SystemType, ...args)
Add a system.

System are always executed in the order they are added: first added, first executed.

See `ASystem` documentation for more informations.

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

<a name="SystemComponent+earlyUpdate"></a>

### systemComponent.earlyUpdate()
Call `earlyUpdate()` on all registered systems.

**Kind**: instance method of [<code>SystemComponent</code>](#SystemComponent)  
<a name="SystemComponent+lateUpdate"></a>

### systemComponent.lateUpdate()
Call `lateUpdate()` on all registered systems.

**Kind**: instance method of [<code>SystemComponent</code>](#SystemComponent)  
