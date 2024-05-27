varying vec2 vUv;
uniform float uTime;

#define saturate(a) clamp( a, 0.0, 1.0 )


float graph(vec2 p){
    float g = 0.;
    vec2 lv = fract(p *5.);
    vec2 id = floor(p*5.);

    float d = max(abs(lv.x - 0.5), abs(lv.y - 0.5));

    g = smoothstep(0.45, 0.5,d);
    
    return g;
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main( )
{
    
    vec2 uv = vUv;
    uv-=0.5;
    uv*=2.;

    float g = graph(uv);
    vec3 color = mix(vec3(0.5), vec3(1.), g);

    float opacity = map(vUv.y, 0., 1., 0.5, 0.);
    opacity = saturate(opacity);

    gl_FragColor = vec4(color , opacity);

}