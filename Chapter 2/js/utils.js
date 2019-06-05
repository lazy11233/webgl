const utils = new utilsObjdect();

function utilsObjdect() {}

utilsObjdect.prototype.getGLContext = function (name) {
  const canvas = document.getElementById(name);
  let ctx = null;
  if (!canvas) {
    alert('there is no canvas element on this page');
    return null;
  } else {
    c_width = canvas.width;
    c_height = canvas.height;
  }
  ctx = canvas.getContext('webgl');
  if (ctx === null) {
    alert('Could not initialise WebGL');
    return null;
  } else {
    return ctx;
  }
}

utilsObjdect.prototype.getShader = function(gl ,id) {
  let script = document.getElementById(id);
  if(!script) {
    return null;
  }
  let str = '';
  let k = script.firstChild;
  while (k) {
    if(k.nodeType === 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }
  let shader;
  if(script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if(script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
  gl.shaderSource(shader, str);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

utilsObjdect.prototype.requestAnimFrame = function(o) {
  requestAnimFrame(o);
}

requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
      window.setTimeout(callback, 1000/60);
    };
})();
