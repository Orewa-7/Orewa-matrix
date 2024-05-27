varying vec2 vUv;
uniform float uWeapon;
uniform vec3 uColor;

#define M_PI 3.1415926535897932384626433832795
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

vec4 pistol(vec2 p){
    
    vec4 color = vec4(1.0);
    // Arc
    float size = 0.35;
    float t = 3.14159*(0.5+0.5*cos(0.1)) * size;
    vec2 cs = vec2(cos(t),sin(t));
    vec2 uv = abs(p - 0.5);
    uv =uv - vec2(0., 0.);
    uv*=rotate2D(M_PI * 0.5);
    float radius = 0.44;
    float width = 0.03;
    float line = sdRing(uv, cs, radius, width);
    line = smoothstep(0.02, 0., line) * 0.75;

    //Big Circle
    float c = sdCircle(uv, 0.3);
    c=abs(c);
    c = smoothstep(0.05, 0., c);

    //small circle
    float c2 = sdCircle(uv, 0.05);
    c2= smoothstep(0.02, 0., c2);
    c+=c2;

    // triangles
    uv = p - 0.5;
    uv.x = abs(uv.x);
    uv*=rotate2D(M_PI * 0.5);
    float t1 = sdTriangleIsosceles(uv - vec2(0., 0.1), vec2(0.05, 0.35));
    t1 = smoothstep(0.02, 0., t1);


    line += c;
    line = max(t1,line);
    color.rgb = vec3(uColor) * line;
    color.a = line;
    return color;
}


vec4 rifle(vec2 p){
    vec4 color = vec4(1.0);
    vec2 uv = abs((p - 0.5)*2.);
    float line = sdfLine(uv, vec2(0., 0.7), vec2(0.6, 0.7));
    line = smoothstep(0.1, 0., line) ;
    float l2 = sdfLine(uv, vec2(0.6, 0.7), vec2(0.8, 0.5));
    l2 = smoothstep(0.1, 0., l2) ;
    line = max(line, l2);

    // Arc
    float size = 0.2;
    float t = 3.14159*(0.5+0.5*cos(0.1)) * size;
    vec2 cs = vec2(cos(t),sin(t));
    uv = abs(p - 0.5);
    uv =uv - vec2(0., 0.);
    uv*=rotate2D(M_PI * 0.5);
    float radius = 0.3;
    float width = 0.03;
    float a = sdRing(uv, cs, radius, width);
    a = smoothstep(0.02, 0., a);
    line += a;

    //Big Circle
    float c = sdCircle(uv, 0.2);
    c=abs(c);
    c = smoothstep(0.05, 0., c);

    //small circle
    float c2 = sdCircle(uv, 0.05);
    c2= smoothstep(0.02, 0., c2);
    c+=c2;

    line += c;

    color.rgb = vec3(uColor) * line;
    color.a = line;
    return color;
}


vec4 sniper(vec2 p){
    vec4 color = vec4(1.0);
    // Big Arcs
    float size = 0.15;
    float t = 3.14159*(0.5+0.5*cos(0.)) * size;
    vec2 cs = vec2(cos(t),sin(t));
    vec2 uv = abs(p - 0.5);
    uv =uv - vec2(0., 0.);
    uv*=rotate2D(M_PI * 0.5);
    float radius = 0.44;
    float width = 0.03;
    float line = sdRing(uv, cs, radius, width);
    line = smoothstep(0.02, 0., line) ;

    uv = abs(p - 0.5);
    uv =uv - vec2(0., 0.);
    uv*=rotate2D(M_PI * 0.);
    float line2 = sdRing(uv, cs, radius, width);
    line2 = smoothstep(0.02, 0., line2) ;

    line += line2;

    // Small Arcs
    size = 0.15;
    t = 3.14159*(0.5+0.5*cos(0.)) * size;
    uv =uv - vec2(0., 0.);
    uv*=rotate2D(M_PI * 0.5);
     radius = 0.3;
     width = 0.03;
    line2 = sdRing(uv, cs, radius, width);
    line2 = smoothstep(0.02, 0., line2) ;
    line += line2;
    uv = abs(p - 0.5);
    uv =uv - vec2(0., 0.);
    uv*=rotate2D(M_PI * 0.);
    line2 = sdRing(uv, cs, radius, width);
    line2 = smoothstep(0.02, 0., line2) ;
    line += line2;



    //Big Circle
    float c = sdCircle(uv, 0.15);
    c=abs(c);
    c = smoothstep(0.05, 0., c);


    // triangles
    uv = p - 0.5;
    uv.x = abs(uv.x);
    uv*=rotate2D(M_PI * 0.5);
    float t1 = sdTriangleIsosceles(uv - vec2(0., 0.1), vec2(0.05, 0.35));
    t1 = smoothstep(0.02, 0., t1);

    uv = p - 0.5;
    uv.y = abs(uv.y);
    uv*=rotate2D(M_PI * 0.);
    float t2 = sdTriangleIsosceles(uv - vec2(0., 0.1), vec2(0.05, 0.35));
    t2 = smoothstep(0.02, 0., t2);

    t1+=t2;


    line += c;
    line = max(t1,line);
    color.rgb = vec3(uColor) * line;
    color.a = line;
    return color;
}

void main (){


    vec4 color = sniper(vUv);
    if(uWeapon == 1.){
        color = pistol(vUv);
    } else if(uWeapon == .5){
        color = rifle(vUv);
    }

    gl_FragColor = color;
}