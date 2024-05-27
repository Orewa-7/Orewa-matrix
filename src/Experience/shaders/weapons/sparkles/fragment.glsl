uniform sampler2D uTexture;
uniform vec3 uColor;
uniform float uProgress;
uniform float uTime;


varying float vAngle;
varying float vShape;


#define M_PI 3.1415926535897932384626433832795


float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

mat2 rotate2D(float _angle){
    float s = sin(_angle);
    float c = cos(_angle);
    return mat2(c, -s, s, c);
}

float sdRoundedX( in vec2 p, in float w, in float r )
{
    p = abs(p);
    return length(p-min(p.x+p.y,w)*0.5) - r;
}

vec3 roundedX(in vec2 p){
    vec3 color = vec3(0.);
    vec2 uv = p - 0.5;
    uv*=rotate2D(M_PI * vAngle + uTime);
    float t = sdRoundedX(uv, 0.1, 0.01);
    t = smoothstep(0.001, 0., t);
    color = vec3(t);
    return color;
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

vec3 triangle(in vec2 p){
    vec3 color = vec3(0.);
    vec2 uv = p - 0.5;
    uv*=rotate2D(M_PI * vAngle + uTime);
    float t = sdTriangleIsosceles(uv - vec2(0., 0.), vec2(0.1, 0.2)) ;
    t = abs(t) - 0.01;
    t = smoothstep(0.001, 0., t);
    color = vec3(t);
    return color;
}

float sdCircle( vec2 p, float r )
{
    return length(p) - r;
}

vec3 circle(in vec2 p){
    vec3 color = vec3(0.);
    vec2 uv = p - 0.5;
    uv*=rotate2D(M_PI * vAngle + uTime);
    float t = sdCircle(uv, 0.1);
    t=abs(t) - 0.01;
    t = smoothstep(0.001, 0., t);
    color = vec3(t);
    return color;
}


void main()
{
    float progress = uProgress * 2.0;
    // opacity
    float opacityProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
    opacityProgress = clamp(opacityProgress, 0.0, 1.0);

    float shape = floor(vShape);
    vec3 color = triangle(gl_PointCoord);
    if(shape == 1.0) color = roundedX(gl_PointCoord);
    if(shape == 2.0) color = circle(gl_PointCoord);

    // Final color
    gl_FragColor = vec4(color * uColor * 12., color.r * opacityProgress);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}