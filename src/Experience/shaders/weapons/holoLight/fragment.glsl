#define saturate(a) clamp( a, 0.0, 1.0 )

varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;

#define PI 3.1415926535897932384626433832795

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

float noise( in vec2 x )
{
    vec2 i = floor(x);
    vec2 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = i.x + i.y*57.0;

    return mix(mix( hash(n+ 0.0), hash(n+ 1.0),f.x),
               mix( hash(n+57.0), hash(n+58.0),f.x),f.y);
}

float fbm( vec2 p )
{
    float f = 0.0;
    f += 0.50000*noise( p ); p = m*p*2.02;
    f += 0.25000*noise( p ); p = m*p*2.03;
    f += 0.12500*noise( p ); p = m*p*2.01;
    f += 0.06250*noise( p ); p = m*p*2.04;
    f += 0.03125*noise( p );
    return f/0.984375;
}


void main( )
{
    vec2 position = vPosition.xy;
    position.y += .55;
    float r = sqrt(dot(position.xy, position.xy));

    float angle = atan(position.x, position.y ) / (PI * 2.0) + 0.5;
    float s = sin(angle * 2.0);
    s *= fbm(vec2((.2+ uTime), angle * 200. ));
    s=smoothstep(0., 1., s);
    s*=0.3;

    vec3 col = vec3(s);

    float opacity = map(abs(position.x), 0., 0.9, 1., 0.);
    opacity = saturate(opacity);
    opacity*=map(position.y, 0., .5, 1., 0.);
    opacity = saturate(opacity);
    opacity = opacity*opacity*opacity*(3.-2.*opacity); // smoothstep(0., 1., opacity);
    

    // Output to screen
    gl_FragColor = vec4(col,opacity);
}