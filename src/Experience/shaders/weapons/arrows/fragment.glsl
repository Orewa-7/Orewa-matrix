#define saturate(a) clamp( a, 0.0, 1.0 )

varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uHoveredColor;

float sdfLine(vec2 p, vec2 a, vec2 b){

    vec2 pa = p-a;
    vec2 ba = b-a;
    float h = clamp(dot(pa,ba)/dot(ba,ba), 0. ,1.);
    
    float line = length(pa-ba*h);
    
    
    return line;
}

void main( )
{
    vec2 uv = vUv;
    uv-=0.5;
    uv*=2.;

    uv.y = abs(uv.y);
    float d = sdfLine(uv, vec2(-0.75,0.5), vec2(-0.25,0.));
    d= smoothstep(0.1, 0.,d);
    d += smoothstep(0.1, 0.,  sdfLine(uv, vec2(-0.25,0.5), vec2(0.25,0.)));
    d += smoothstep(0.1, 0.,  sdfLine(uv, vec2(0.25,0.5), vec2(0.75,0.)));
    

    float x = mod(uTime * 0.5, 1.) * 4. - 2.;
    float pass = smoothstep(0.5, 0.,  sdfLine(uv, vec2(x,0.), vec2(x,0.75) ));
    vec3 passColor = uHoveredColor * pass * d  * 10.;



    vec3 color = vec3(uColor) * d * 12. ;
    color += passColor;

    gl_FragColor = vec4(color,1.);
}