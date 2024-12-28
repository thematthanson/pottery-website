const t=document.getElementById("glitter-canvas"),e=t.getContext("webgl");function a(){t.width=window.innerWidth,t.height=window.innerHeight}a();window.addEventListener("resize",a);const v=`
    attribute vec2 a_position;
    varying vec2 v_uv;

    void main() {
        v_uv = a_position * 0.5 + 0.5; // Map positions to UV space
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`,g=`
    precision mediump float;
    varying vec2 v_uv;

    float random(vec2 uv) {
        return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
        float sparkle = step(0.9, random(v_uv + mod(gl_FragCoord.xy, 10.0) / 10.0));
        vec3 color = mix(vec3(1.0, 0.84, 0.0), vec3(0.9, 0.5, 0.1), random(v_uv));
        gl_FragColor = vec4(color * sparkle, 1.0);
    }
`;function n(s,d){const o=e.createShader(s);return e.shaderSource(o,d),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)?o:(console.error(e.getShaderInfoLog(o)),e.deleteShader(o),null)}const l=n(e.VERTEX_SHADER,v),m=n(e.FRAGMENT_SHADER,g),r=e.createProgram();e.attachShader(r,l);e.attachShader(r,m);e.linkProgram(r);e.getProgramParameter(r,e.LINK_STATUS)||(console.error(e.getProgramInfoLog(r)),e.deleteProgram(r));const u=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,u);e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);e.useProgram(r);const i=e.getAttribLocation(r,"a_position");e.enableVertexAttribArray(i);e.vertexAttribPointer(i,2,e.FLOAT,!1,0,0);function c(){e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.TRIANGLES,0,6),requestAnimationFrame(c)}c();
