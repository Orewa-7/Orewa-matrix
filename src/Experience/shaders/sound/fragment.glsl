#define saturate(a) clamp( a, 0.0, 1.0 )

varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uFrequency;

float sdCircle(vec2 p, float r )
{
    return length(p) - r;
}

float fbm(float x, int o){

    float frequency = 50.;
    float amplitude = 0.1;
    float d = 0.;
    float div = 0.2;

    d-=sin(x * frequency + uTime ) * amplitude * uFrequency;
    
    return d/div;
}

void main( )
{
    vec2 uv = vUv;
    uv-=0.5;
    uv*=2.;

    vec2 lv = fract(uv *5.);
    lv=abs(lv-0.5);

    float g = max(lv.x, lv.y);
    g = smoothstep(0.45, 0.5, g) ;

    float d = length(uv) - 0.75;
    d= 1. - step(0.2, d);
    float r = 0.475;
    float width = 0.01;
    float border = 1.0 - step(width, abs(distance(vUv, vec2(0.5)) - r));


    float y = abs(uv.y - fbm(uv.x, 1));
    float f = smoothstep(0.05, 0., y);
    f*=step(0.2, d);
    
    vec3 bloomy = uColor * 7.;

    vec3 color = vec3(g) * vec3(d);
    color = mix(color, vec3(1.), border);
    color = mix(color, bloomy, f);
    // color = vec3(d);

    gl_FragColor = vec4(color,color.r);
}