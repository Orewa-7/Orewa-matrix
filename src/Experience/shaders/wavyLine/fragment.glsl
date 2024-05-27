#define saturate(a) clamp( a, 0.0, 1.0 )

varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;

float sdCircle(vec2 p, float r )
{
    return length(p) - r;
}

float opOnion( vec2 p, float r )
{
  return abs(sdCircle(p, r));
}

float sdfLine(vec2 p, vec2 a, vec2 b){

    vec2 pa = p-a;
    vec2 ba = b-a;
    float h = clamp(dot(pa,ba)/dot(ba,ba), 0. ,1.);
    
    float line = length(pa-ba*h);
    line = smoothstep(0.03, 0.,line);
    
    
    return line;
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float fbm(float x, int o){

    float frequency = 2.;
    float amplitude = 0.2;
    float d = 0.;

    for(int i = 0; i < o; i ++){
        d+=sin(x * frequency + uTime ) * amplitude;
        frequency*=2.;
        amplitude*=0.5;
    }
    
    return d;
}

float points(vec2 p, float start, float frequency ,int count, float y){
    float f = 0.;
    float s = start;
    for(int i = 0; i<count; i++){
        
        float c = sdCircle(vec2(p.x - s, y), 0.01);
        c=smoothstep(0.12, 0.02, c);
        
        float r = fract(uTime * 0.5 );
        float maxR = 0.2;
        r = map(r, 0., 1., 0., maxR);
        r = saturate(r);
        float ac = opOnion(vec2(p.x - s, y), r);
        ac = smoothstep(0.02, 0., ac);
        ac*= (maxR * 1.5 - r );
        
        f+=c + ac;
        
        s+=frequency;
    }
    return f;
}

float borders(vec2 p, float aspect){
    p=abs(p);
    // float aspect = iResolution.x/iResolution.y;
    
    float b = 0.;
    
    b = sdfLine(p, vec2(.995 * aspect, 0.75), vec2(0.995 * aspect, 1.));
    b+= sdfLine(p, vec2(.85 * aspect, .999), vec2(1. * aspect, .999));
    
    
    return b;
    
}

void main( )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = vUv;
    uv-=0.5;
    uv*=2.;
    float aspect = 1.5;
    uv.x *= aspect;
    
    vec3 col = vec3(0.);
    
    float border = borders(uv, aspect);
    col += vec3(border);
    
    float y = abs(uv.y - fbm(uv.x, 3));
    float f = smoothstep(0.03, 0., y);
    col += vec3(f);
    
    float points = points(uv, -1.2, 0.6, 5 , y);
    col = mix(col, uColor, points);
    
    


    // Output to screen
    gl_FragColor = vec4(col,col.x);
}