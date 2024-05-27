varying vec2 vUv;
uniform vec3 uColor;
uniform float uTime;
uniform float uSize;

#define M_PI 3.1415926535897932384626433832795
#define saturate(a) clamp( a, 0.0, 1.0 )
float dot2(in vec2 v ) { return dot(v,v); }

float sdfLine(vec2 p, vec2 a, vec2 b){

    vec2 pa = p-a;
    vec2 ba = b-a;
    float h = clamp(dot(pa,ba)/dot(ba,ba), 0. ,1.);
    
    float line = length(pa-ba*h);
    
    
    return line;
}

float sdRing( in vec2 p, in vec2 n, in float r, float th )
{
    p.x = abs(p.x);
   
    p = mat2x2(n.x,n.y,-n.y,n.x)*p;

    return max( abs(length(p)-r)-th*0.5,
                length(vec2(p.x,max(0.0,abs(r-p.y)-th*0.5)))*sign(p.x) );
}

float sdTriangleIsosceles( in vec2 p, in vec2 q )
{
    p.x = abs(p.x);
    vec2 a = p - q*clamp( dot(p,q)/dot(q,q), 0.0, 1.0 );
    vec2 b = p - q*vec2( clamp( p.x/q.x, 0.0, 1.0 ), 1.0 );
    float s = -sign( q.y );
    vec2 d = min( vec2( dot(a,a), s*(p.x*q.y-p.y*q.x) ),
                  vec2( dot(b,b), s*(p.y-q.y)  ));
    return -sqrt(d.x)*sign(d.y);
}

float sdCircle( vec2 p, float r )
{
    return length(p) - r;
}

mat2 rotate2D(float _angle){
    float s = sin(_angle);
    float c = cos(_angle);
    return mat2(c, -s, s, c);
}

vec4 arc(vec2 p){
    
    vec4 color = vec4(1.0);
    // Arc
    float size = 0.2;
    float t = 3.14159*(0.5+0.5*cos(0.1)) * size;
    vec2 cs = vec2(cos(t),sin(t));
    vec2 uv = p - 0.5;
    uv =uv - vec2(0., 0.);
    uv*=rotate2D(sin(-M_PI * 0.25 + uTime * 0.5));
    float radius = 0.48;
    float width = 0.01;
    float line = sdRing(uv, cs, radius, width);
    line = smoothstep(0.02, 0., line) * 0.75;

    // Arc2
    size = 0.1;
    t = 3.14159*(0.5+0.5*cos(0.1)) * size;
    cs = vec2(cos(t),sin(t));
    uv = (p - 0.5);
    uv =uv - vec2(0., 0.);
    uv*=rotate2D(M_PI * 0.75 + uTime);
    width = 0.025;
    float line2 = sdRing(uv, cs, radius, width);
    line2 = smoothstep(0.0075, 0., line2) * 0.75;

    line = max(line, line2);


    //small circle
    uv = p - vec2(0.515, 0.525);
    uv.x = abs(uv.x);
    float c = sdCircle(uv - vec2(0.15, 0.), 0.01);
    c = smoothstep(0.01, 0., c) * 0.5;

    // Arc3
    size = uSize;
    t = 3.14159*(0.5+0.5*cos(0.1)) * size;
    cs = vec2(cos(t),sin(t));
    uv = p - vec2(0.5125, 0.52);
    uv =uv - vec2(0., 0.);
    uv*=rotate2D(M_PI * 0.75 + uTime);
    width = 0.025;
    radius = 0.2125;
    line2 = sdRing(uv, cs, radius, width);
    line2 = smoothstep(0.0075, 0., line2) ;

    line = max(line, line2);
    


    line += c;

    color.rgb = vec3(1.) * line;
    color.rgb = mix(color.rgb, uColor * 6.96, line2);
    color.a = line;
    return color;
}



void main (){


    vec4 color = arc(vUv);
    gl_FragColor = color;
}