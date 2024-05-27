#define saturate(a) clamp( a, 0.0, 1.0 )

varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;

void main( )
{
    vec3 color = vec3(0.0);
    color = vec3( sin( uTime  * 2.- vPosition.y * 100.0 ) ) * 0.15 ;

    gl_FragColor = vec4(color,1.);
}