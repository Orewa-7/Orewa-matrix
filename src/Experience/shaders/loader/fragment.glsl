
varying vec2 vUv;
uniform float uTime;
uniform float uProgress;
uniform vec3 uColor;
uniform vec3 uHoveredColor;
uniform float uAlpha;

#define saturate(a) clamp( a, 0.0, 1.0 )
#define PI 3.14159265359

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float sdfLine(vec2 p, vec2 a, vec2 b){

    vec2 pa = p-a;
    vec2 ba = b-a;
    float h = clamp(dot(pa,ba)/dot(ba,ba), 0. ,1.);
    
    float line = length(pa-ba*h);
    
    
    return line;
}

mat2 rot(float a){
    return mat2(cos(a), -sin(a), sin(a), cos(a));
}

vec4 loader(vec2 p){
    vec4 color = vec4(0.);
    vec2 uv = p;

    float a = sdBox(uv - vec2(0., -0.6), vec2(0.85, 0.2));
    // a=step(0., a);
    a = smoothstep(0., 0.1, a);
    color.a = 1. - a;

    // uv = rot(PI) * uv;
    float line = uv.y - uv.x;
    line = sin(line * 50.);
    line = saturate(line);
    float progress = uProgress * 2. - 1.;
    float x = smoothstep(progress - 0.1, progress, p.x);
    x= 1.-x;

    color.rgb = vec3(line) * 0.01;
    vec3 coulor = uHoveredColor * 11.;
    color.rgb = mix(color.rgb, coulor, x) * line ;


    return color;
}

vec4 lines(vec2 p ) {
    vec4 color = vec4(0.);
    vec2 uv = p;

    // uv = rot(PI) * uv;
    float line = sdfLine(uv, vec2(-0.925, -0.2), vec2(0.925, -0.2));
    line = smoothstep(0.001, 0.0, line);
    float line2 = sdfLine(uv, vec2(-0.925, -0.2), vec2(-0.925, -0.225));
    line2 = smoothstep(0.001, 0.0, line2);
    line = max(line, line2);


    line2 = sdfLine(uv, vec2(-0.3, 0.9), vec2(0.925, 0.9));
    line2 = smoothstep(0.002, 0.0, line2);
    line = max(line, line2);
    line2 = sdfLine(uv, vec2(-0.3, 0.9), vec2(-0.3, 0.875));
    line2 = smoothstep(0.001, 0.0, line2);
    line = max(line, line2);

    line2 = sdfLine(uv, vec2(-0.925, 0.9), vec2(-0.4, 0.9));
    line2 = smoothstep(0.002, 0.0, line2);
    line = max(line, line2);
    line2 = sdfLine(uv, vec2(-0.925, 0.9), vec2(-0.925, 0.875));
    line2 = smoothstep(0.001, 0.0, line2);
    line = max(line, line2);






    color = vec4(line) ;

    return color;

}
void main( )
{
    vec2 uv = vUv;
    uv-=0.5;
    uv*=2.;

    vec4 color = vec4(0.);
    color.a = 1.; 
    vec4 loaderColor = loader(uv);
    color = mix(color, loader(uv), loaderColor.a);
    color += lines(uv) ;

    color.a *= uAlpha;
    gl_FragColor = color;
}