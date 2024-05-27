varying vec2 vUv;
uniform float uTime;

#define saturate(a) clamp( a, 0.0, 1.0 )


float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float linearRandom(vec2 uv){
    vec2 st = uv * vec2(15., 4.); 
    st.x-=-uTime * 4.;
    vec2 ipos = floor(st);  // get the integer coords
    vec2 fpos = fract(st);  // get the fractional coords
    
    float time2 = floor(uTime * 2.);
    float rand = random( ipos);
    if(rand < 0.2){
        rand = 0.;
    } else if (rand < 0.6){
        rand = random(ipos + time2);
    }
    
    float f = 1. - abs(uv.y );
    f=smoothstep(0.3, .35, f); 

    float o = 1. - vUv.x;
    o = o*o*o*(3.-2.*o); // smoothstep(0.,1.,o);
    f*=o;
    return rand * f;   
}

float sdfLine(vec2 p, vec2 a, vec2 b){

    vec2 pa = p-a;
    vec2 ba = b-a;
    float h = clamp(dot(pa,ba)/dot(ba,ba), 0. ,1.);
    
    float line = length(pa-ba*h);
    
    
    return line;
}

float borders(vec2 p, float aspect){
    
    // float aspect = iResolution.x/iResolution.y;
    
    float b = 0.;
    
    b = sdfLine(p, vec2(-.9 * aspect, 0.98), vec2(0.995 * aspect, 0.98));
    b = smoothstep(0.03, 0.,b);
    float b2 = sdfLine(p, vec2(.7 * aspect, 0.98), vec2(0.995 * aspect, 0.98)); // big line
    b2 = smoothstep(0.09, 0.03,b2);
    b+=b2;
    b2 = sdfLine(p, vec2(-.95 * aspect, .9), vec2(-.91 * aspect, 0.98)); // little line
    b2 = smoothstep(0.02, 0.,b2);
    b+=b2;

    b2 = sdfLine(p, vec2(-.995 * aspect, -0.98), vec2(0.9 * aspect, -0.98));
    b2 = smoothstep(0.03, 0.,b2);
    b+=b2;
    b2 = sdfLine(p, vec2(.95 * aspect, -.9), vec2(.91 * aspect, -0.98)); // little line
    b2 = smoothstep(0.02, 0.,b2);
    b+=b2;

    
    
    return b;
    
}

void main( )
{
    
    vec2 uv = vUv;
    uv-=0.5;
    uv*=2.;
    uv.x *= 1.5 ;
    
    float rand = linearRandom(uv);
    vec3 color =vec3(rand);

    color += vec3(borders(uv, 1.5));

    gl_FragColor = vec4(color ,color.x);

}