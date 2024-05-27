#define saturate(a) clamp( a, 0.0, 1.0 )

varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;

float sdCircle(vec2 p, float r )
{
    return length(p) - r;
}

void main( )
{
    vec2 uv = vUv;
    uv-=0.5;
    uv*=2.;

    vec2 lv = fract(uv *5.);
    lv=abs(lv-0.5);

    float g = max(lv.x, lv.y);
    g = smoothstep(0.45, 0.5, g);

    float d = length(uv) - 0.25;
    d= step(0.2, d);
    float r = 0.225;
    float width = 0.005;
    float border = 1.0 - step(width, abs(distance(vUv, vec2(0.5)) - r));
    


    vec3 color = vec3(g) * vec3(d);
    color = mix(color, vec3(1.), border);
    // color = vec3(d);

    gl_FragColor = vec4(color,1.);
}