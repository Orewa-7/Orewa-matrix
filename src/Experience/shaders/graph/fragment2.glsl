varying vec2 vUv;

#define REPETITION 15. 
//0.9
#define X_MAX .9
//0.5
#define Y_MAX .6

#define M_PI 3.1415926535897932384626433832795

float band(float start, float end, float direction, float blur){
    float f = smoothstep(start-blur, start+blur, direction);
    f*=smoothstep(end+blur, end-blur, direction);
return f;
}

float rect(vec2 p, float left, float right, float bottom, float top, float blur){
    float f = band(left, right, p.x, blur);
    f*=band(bottom, top, p.y, blur);
    return f;
}

float sdfLine(vec2 p, vec2 a, vec2 b){

    vec2 pa = p-a;
    vec2 ba = b-a;
    float h = clamp(dot(pa,ba)/dot(ba,ba), 0. ,1.);
    
    float line = length(pa-ba*h);
    
    
    return line;
}

vec4 bigBands(vec2 p){
    vec4 col = vec4(1.);
    vec2 uv = p;
    uv.x = abs(uv.x);
    int count = 10;
    float d =0.;
    for(int i = 0; i < count; i++){
        float y = 0.34 - 0.07 * float(i);
        float line = sdfLine(uv, vec2(0.6, y), vec2(0.68, y));
        line = smoothstep(0.005, 0.0, line);
        d+=line;
    }

    col.rgb = vec3(d);
    
    return col;
    
}

vec4 lilBands(vec2 p){
    vec4 col = vec4(1.);
    float offset = 0.2;

    vec2 uv = p;
    uv.x = abs(uv.x);
    int count = 37;
    float d =0.;
    for(int i = 0; i < count; i++){
        float y = 0.34 - (0.07/4.) * float(i);
        float line = sdfLine(uv, vec2(0.6, y), vec2(0.625, y));
        line = smoothstep(0.0025, 0.0, line);
        d+=line;
    }

    col.rgb = vec3(d) * 0.5;
    
    return col;

}


vec4 bands(vec2 p){
    vec4 col= vec4(1.);
    
    p.y -= -0.025;
    col = bigBands(p) + lilBands(p);
    
    return col;
}

vec4 graphView(vec2 p ){
    vec4 col = vec4(1.);
    vec2 lv = fract(p *vec2(8., 9.));
    lv-=0.5;
    lv=abs(lv);
    
    float d = max(lv.x, lv.y);
    d=smoothstep(0.45, 0.5, d);

    
    col.rgb = vec3(d)*0.25;
    col.a = d;

    vec2 uv = abs(p);
    float border = sdfLine(uv, vec2(0.75, 0.55) ,vec2(0.75, 0.5));
    border = smoothstep(0.005, 0.0, border);
    border += smoothstep(0.005, 0.0, sdfLine(uv, vec2(0.7, 0.555) ,vec2(0.75, 0.555)));
    col.rgb += border; 
    
    return col;
}



vec4 lilTargets(vec2 p){
    vec4 col = vec4(1.);
    
    p = abs(p);
    
    float d = rect(p, -0.1, 0.5, 0.375, 0.38, 0.001);
    float line = sdfLine(p, vec2(0.5, 0.38) ,vec2(0.52, 0.4));
    line = smoothstep(0.005, 0.0, line);
    d+= line;
    d+=rect(p, 0.52, 0.55, 0.398, 0.402, 0.001);
    
    //circle
    float c = length(p-vec2(0.62, 0.4));
    //radius
    c-=0.03;
    c=abs(c);
    //band width
    c = 1. - smoothstep(0.0, 0.005,c);
    d=max(d,c);
    
    //target inside circle
    float lines = sdfLine(p, vec2(0.62, 0.35) ,vec2(0.62, 0.45));
    lines = smoothstep(0.005, 0.0, lines);
    lines +=  smoothstep(0.005, 0.0, sdfLine(p, vec2(0.57, 0.4) ,vec2(0.67, 0.4)));
    
    d= max(d,lines);
    
    
    
    col.rgb = vec3(d) * 0.75;
    
    return col;
}

void main( )
{
    vec2 uv = vUv;
    uv-=0.5;
    uv.x *= 1.5; 
    uv.y *= 1.125;

    vec4 col = bands(uv);
    col = max(col, graphView(uv));
    col += lilTargets(uv);
    col.a = step(0.01, col.r);
    col.a *=rect(uv, -0.753, 0.75, -0.56, 0.555, 0.001);
     

    gl_FragColor = vec4(col );
}