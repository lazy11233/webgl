# WebGL Beginner's Guide

`WebGL` 是一种在浏览器上运行、不需要额外安装其他软件或插件的3D网页技术。

## Chapter 1: Getting Started with WebGL

`WebGL` 基于 `OpenGL ES 2.0(ES standing for Embedded Systems 嵌入式系统)` ，一种支持苹果得iPhone、iPad的特殊版本的 `OpenGL` 。但是作为特殊版本的进化版，`WebGL` 以提供便携式、跨平台和设备为目标称为独立的技术。

第一章：

* 理解 `WebGL` 应用的结构组成
* 设置画图区域 ` canvas ` 
* 测试浏览器 `WebGL` 的兼容性
* 理解 `WebGL` 作为状态机的作用
* 在场景中修改 `WebGL` 的变量
* 加载一个完整功能的场景

### 系统要求：

* FireFox4.0 及以上版本
* Google Chrome 11及以上版本
* Safari(OSX 10.6及以上版本)
* Opera 12及以上版本

### WebGL 提供的渲染功能

第一个区别：是否使用特殊的绘图硬件。基于软件渲染在3D场景中使用的是计算机的处理器，CPU；而基于硬件渲染的场景中使用的 `Graphics Processing Unit (GPU)` 。`harware-based rendering`方式更加有效，因为有专门的硬件处理图形绘画计算。`software-based` 方式渲染更普遍，因为不需要额外的处理器。

第二个区别：在local或remote渲染3D场景。当需要渲染的图像太过于复杂时，一般选择使用远程渲染。3D动画电影渲染过程需要大量的渲染服务器来渲染。我们把它称为 `server-based rendering` 。相反的本地渲染称为： `client-based rendering` 。

`WebGL` 和其他技术相比的优点：

- JavaScript Programming : `JavaScript` 允许你调用所有的DOM同时轻易实现两个元素间通信功能。同时能应用H5技术和 `jQuery` 等前端技术。
- Automatic memory management : 其他的技术可能会需要开发者自己管理内存，极可能造成内存泄露、溢出等情况。自动管理技术遵循变量作用域原则自动解除不需要的变量内存。
- Pervasiveness : 浏览器发展的机遇，在智能手机和平板设备的兼容性问题解决的很好。
- Performance : WebGL应用在性能上能和独立桌面应用一较高下(也有列外)。现在很多3D web 渲染依然依靠 `soft-based render` 的方式
- Zero compilation : WebGL 使用 `JavaScript` 语言，在浏览器上运行前不需要提前编译。

###  WebGL应用的结构

* Canvas : 这是一个场景渲染的占位符 `placeholder` 。是一个标准的H5页面元素
* Objects : 组成3D场景的实体。实体是由很多的三角形组成( `triangles` )。
* Lights : 没有灯光的话，在场景里什么也看不见。
* Camera : canvas就是一个3D世界，Camera就是我们观察这个世界的视口。

### 创建一个 HTML5 canvas

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WebGL beginner' Guide : Setting up the canvas</title>
  <style>
    canvas {
      border: 2px dotted blue;
    }
  </style>
</head>
<body>
  <canvas id="canvas-element-id" width="800" height="600"></canvas>
</body>
</html>

```

### canvas attributes

* id : DOM 结构的身份id
* width and height : 这俩属性定义了canvas的大小。如果没有定义这两个属性，在Firefox、Chrome和WebKit默认使用 `300 * 150` 大小。

### what if the canvas is not supported?

```html
<canvas>Your browser does not support HTML5 canvas</canvas>
```

### Accessing a WebGL context

`WebGL context` 是一个句柄，通过这个句柄我们能使用 `WebGL` 的功能和属性。这些构成了 `WebGL` 的  `Application Program Interface(API) ` 。

### WebGL is a state machine

`WebGL context` 可以被理解成 `状态机` ：一旦你修改了某个属性，那这个修改就是永久的，直到你再次修改。下面的代码解释

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WebGL Beginner's Guide - Setting up WebGL context</title>
  <style>
    canvas {
      border: 2px dotted blue;
    }
  </style>
  <script>
    let gl = null;
    let c_width = 0;
    let c_height = 0;
    window.onkeydown = checkKey;
    function checkKey(ev) {
      switch (ev.keyCode) {
        case 49: { //1
          gl.clearColor(0.3, 0.7, 0.2, 1.0);
          clear(gl);
          break;
        }
        case 50: { //2
          gl.clearColor(0.3, 0.2, 0.7, 1.0);
          clear(gl);
          break;
        }
        case 51: { //3
          const color = gl.getParameter(gl.COLOR_CLEAR_VALUE);
          alert('clearColor = (' +
            Math.round(color[0] * 10) /10 + ',' +
            Math.round(color[1] * 10) /10 + ',' +
            Math.round(color[2] * 10) / 10 + ')');
          window.focus();
          break;
        }
      }
    }
    function getGLContext() {
      const canvas = document.getElementById('canvas-element-id');
      if(canvas === null) {
        alert('there is no canvas on this page ');
        return;
      }
      const ctx = canvas.getContext('webgl');
      if(!ctx) {
        alert('WebGL is not available');
      } else {
        return ctx;
      }
    }
    function clear(ctx) {
      ctx.clear(ctx.COLOR_BUFFER_BIT);
      ctx.viewport(0, 0, c_width, c_height);
    }
    function initWebGL() {
      gl = getGLContext();
    }
  </script>
</head>
<body onload="initWebGL()">
<canvas id="canvas-element-id" width="800" height="600">Your browser doesn't appear support the HTML5 <code>&lt;canvas&gt;</code> element.</canvas>
</body>
</html>
```

有四个函数：

|   Function   | Description                                                  |
| :----------: | :----------------------------------------------------------- |
|   checkKey   | 监听键盘输入                                                 |
| getGLContext | 获取 `WebGL context` 句柄，返回值为空时表示不支持 `WebGL`    |
|    clear     | `WebGL context` 的一个属性，将画布清除为当前清除的颜色。如前所述，`WebGL` 理解为状态机，因此它会一直维持选中的颜色，直到使用 `WebGL function gl.clearColor()` |
|  initWebGL   | 网页初始化的方法                                             |

### Loading a 3D scene

虚拟 WebGL Car Scene

1. 打开ch1_Car.html 
2. 第二章渲染几何(rendering Geometry)教你如何渲染这个car模型
3. 使用侧边栏动态的修改模型属性
4. 点击、拖拽旋转car和调整car的视角

场景中由以下内容组成：

* A canvas 
* A series of polygonal meshes (Object) that constitute the car: roof, windows, headlights, fenders, doors, wheels， and so on
* Light sources
* A camera that determines where in the 3D world is our view point

## Chapter 2 : Rendering Geometry

`WebGL` 渲染文件遵循 `divide and conquer` 方法。每个多边形都可以分解成三角形、线、和点 基元。

第二章：

* 理解 `WebGL` 定义和执行几何信息
* 讨论相关的API
* 测试使用JSON文件定义、存储和加载复杂的几何体
* 继续分析 `WebGL` 作为一个状态机存储动态属性的过程
* 创建和加载不同的几何模型

### Vertices and Indices (顶点和指数)

`WebGL` 使用标准方法处理几何数，有两个数据类型是基础的几何代表组成任意的3D模型：Vertices、Indices

**Vertices** 是定义3D模型的角(定点数)。每个顶点是由三维坐标来表示：(x, y, z)。`WebGL` 没有提供任何API方法来独立的通过管道穿过顶点。所以我们必须将我们需要的所有顶点定义在JavaScript Array中，再构建 `WebGL` 顶点。

**Indices** 是3D场景的数字标签。它告诉 `WebGL` 产生平面应该怎么链接顶点。就像 `Vertices` 一样，`indices` 也要被定义在 JavaScript Array中

### WebGL绘制流程 

### ![WebGL Rendering Pipeline](./images/webgl-render.png)

#### Vertex Buffer Objects(VBOs)

VBOs包含 `WebGL` 要渲染需要的顶点数据。其他的几种数据类型也可以存储在VBOs中：vertex normals, colors, and textture coordinates 等。

#### Vertex shader(顶点着色器)

每个顶点都会唤起 `Vertex shader` ；着色器控制每个顶点的坐标、法线、颜色、和纹理坐标。

#### Fragment shader(片元着色器)

每三个顶点定义了一个三角形，每一个面上的三角形都必须定义一个颜色，否则我们渲染的面试透明的。

面上的每个元素被称为一个片元(fragment)，这些面将会展示到用户的屏幕上，所以这些fragment通常被称为**pixels **(但并不是一个真正的pixels)

![fragment](./images/fragment.png)

#### Fragmebuffer

包含被Fragment shader处理过的fragments的二维的buffer。一旦所有的fragment都处理好了，一个2D 图像呈现在用户面前。Fragmebuffer是渲染管线的最后一站。

#### Attributes,uniforms, and varyings

**Attributes **是顶点着色器的输入变量。例如，顶点坐标、顶点颜色等。

**Uniforms** 是顶点着色器和片元着色器两者共同的输入变量。不像attributes，uniforms一般是一个常数，比如灯光位置。

**Varyings** 从顶点着色器传递数据到片元着色器

### Rendering geometry in WebGL

下面是在WebGL中渲染一个Object的过程：

1. 首先使用 JavaScript Array 定义一个几何体
2. 其次创建 WebGL buffers
3. 然后，使用VBO中制定好的顶点坐标在顶点着色器上使用
4. 最后，使用IBO来执行渲染

#### Defining a geometry using JavaScript arrays

我们来创建一个梯形，需要定义两个JavaScript Arrays：一个vetices，一个indices

![trapezoid](./images/trapezoid.png)

上面截图展示两个array的对应关系。

#### Creating WebGL buffers

简单的二维数组（z轴全为0）入手：

```javascript
var vertices = [-50.0, 50.0,
               -50.0, -50.0, 0.0,
               50.0, 50.0, 0.0,
               50.0, 50.0, 0.0];
var myBuffer = gl.createBuffer(); // gl is our WebGL context
```

我们通过下面的语句绑定buffer

```javascript
gl.bindBuffer(gl.ARRAY_BUFFER, myBuffer);
```

第一个参数是buffer的一种类型，有两个选项：

* gl.ARRAY_BUFFER: Vertex data
* gl.ELEMENT_ARRAY_BUFFER: Index data

一旦我们绑定了一个buffer，我们需要传递具体内容。通过下面的 `bufferData` 函数实现：

```javascript
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
```

`WebGL` 的 `bufferData()` 不能直接接受JavaScript数组作为参数，而是使用类型数组-直接使用原生库来处理数据。

vertex坐标是浮点型的，indices总是整型。所有我们使用 `FLoat32Array for VBOs` 和 `Uint16Array for IBOs` 。在 `WebGL`中这两种类型数组是最大容量的类型数组。

解绑buffer：

```javascript
gl.bindBuffer(gl.ARRAY_BUFFER, null);
```

```javascript
vertices = [1.5, 0, 0,
        -1.5, 1, 0,
        -1.5, 0.809017, 0.587785,
        -1.5, 0.309017, 0.951057,
        -1.5, -0.309017, 0.951057,
        -1.5, -0.809017, 0.587785,
        -1.5, -1, 0,
        -1.5, -0.809017, -0.587785,
        -1.5, -0.309017, -0.951057,
        -1.5, 0.309017, -0.951057,
        -1.5, 0.809017, -0.587785];

indices = [0, 1, 2,
           0, 2, 3,
           0, 3, 4,
           0, 4, 5,
           0, 5, 6,
           0, 6, 7,
           0, 7, 8,
           0, 8, 9,
           0, 9, 10,
           0, 10, 1];

coneVertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

coneIndexBUffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneIndexBUffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
```

运行这个实例：ch2_cone.html 总结来说：

* Create a new buffer
* Bind it to make it the current buffer
* Pass the buffer data using one of the typed arrays
* Unbind the buffer

#### Association attributes to VBOs

VBOs一经创建，需要关联顶点着色器属性到这些buffer中。每个顶点着色器属性都是一对一关系：

![associat-attribute](./images/associat-attribute.png)

我们通过下面的步骤获取：

1. First, we bind a VBO
2. Next, we point an attribute to the currently bound VBO
3. Finally, we enable the attribute

我们先来看看第一步。我们已经知道如何绑定一个VBO：`gl.bindBuffer(gl.ARRAY_BUFFER, myBuffer)`

myBuffer是我们需要映射的buffer

#### Pointing an attribute to the currently bound VBO

`WebGL` 指定`attribute` 给当前绑定的VBOs的api是：

```javascript
gl.vertexAttributePointer(Index, Size, Type, Norm, Stride, Offset);
```

依次看看各个参数的作用：

* Index : 指定我们需要绑定到的attributes的索引值
* Size : 当前绑定的buffer中每一个顶点值的指针
* Type : 在当前的buffer中的数据类型，以下几种之一：`BYTE, FI XED, UNSIGNED_BYTE, FLOAT, SHORT, or UNSIGNED_SHORT`
* Norm : 用来处理数字转换
* Stride : 如果是0，表示元素是序列化存储在buffer中
* Offset : 通常设置为0

#### Enabling the attribute

```javascript
gl.enableVertextAttribArray(aVertextPosition);
```

![enabling-attribute](./images/enabling-attribute.png)

#### Rendering

一旦我们定义了VBOs并且成功映射了顶点着色器属性，我们即将渲染场景。两个API : `drawArrays` `drawElements` 

##### Using drawArrays

当 `indices` 不可用时，我们就要使用 `drawArrays` 来渲染。大多数情况下，如果场景简单到不需要设置indices时，比如渲染一个三角形和矩形。

![drawArrays](./images/drawArrays.png)

```javascript
gl.drawArrays(Mode, First, Count)
```

Value：

* Mode : 表示要渲染的类型。比如：`gl.POINTS gl.LINE_STRIP`
* FIrst : 在arrays中的起始位置
* Count : arrays元素中的个数

##### Using drawElements

`drawElements` 允许使