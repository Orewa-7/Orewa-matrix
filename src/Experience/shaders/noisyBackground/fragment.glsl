varying vec2 vUv;
uniform float uTime;


float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float roundRandom(vec2 uv){
    float d = length(uv);
    
    vec2 st = uv * 30.0; // Scale the coordinate system by 10
    vec2 ipos = floor(st);  // get the integer coords
    vec2 fpos = fract(st);  // get the fractional coords
    float time = floor(uTime * 5.);

    // Assign a random value based on the integer coord
    
    float rand = random( ipos + random(vec2(time)));
    
    float x = abs(ipos.x);
    float y = abs(ipos.y);
    
    if(x < 12. && y < 12.){
        rand=step(0.2, rand);
    } else if (x < 24. && y < 24.) {
        rand=step(0.5, rand);
    } else {
        rand=step(0.9, rand);
    }
    
    return rand;
}

vec3 realRoundRandom(vec2 uv){

    vec2 st = uv * 30.0; // Scale the coordinate system by 10
    vec2 ipos = floor(st);  // get the integer coords
    vec2 fpos = fract(st);  // get the fractional coords
    float time = floor(uTime * 5.);
    float time2 = floor(uTime);
    float time3 = floor(uTime*10.);
    // Assign a random value based on the integer coord
    
    float rand = random( ipos + random(vec2(time)));
    float rand2 = random( ipos + random(vec2(time2)));
    float rand3 = random( ipos + random(vec2(time3)));
    
    float x = abs(ipos.x);
    float y = abs(ipos.y);
    
    float randomRadius1 = random(ipos + time) * 12.;
    float randomRadius2 = random(ipos - time + 1.) * 12. + 12.;
    vec3 col = vec3(0.);
    
    if(x < randomRadius1 && y <randomRadius1){
        rand=step(0.2, rand2);
        col = mix(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.8, 0.8), rand);
    } else if (x < randomRadius2 && y < randomRadius2) {
        rand=step(0.5, rand);
        col = mix(vec3(0.25, 0.25, 0.25), vec3(0.5, 0.5, 0.5), rand);
    } else {
        rand=step(0.9, rand3);
        col = mix(col, vec3(0.25, 0.25, 0.25), rand);
    }
    
    return col;
    
}

float linearRandom(vec2 uv){
    vec2 st = uv * vec2(8., 2.); 
    float time = floor(uTime * 7.);
    st.x-=-time;
    vec2 ipos = floor(st);  // get the integer coords
    vec2 fpos = fract(st);  // get the fractional coords
    
    float time2 = floor(uTime * 2.);
    float rand = random( ipos);
    if(rand < 0.5){
    rand = random(ipos + time2);
    } 
    
    rand*=rand ;
    
    
    
    return rand;

    
}

void main( )
{
    
    vec2 uv = vUv;
    uv-=0.5;
    uv*=2.;
    // uv.x *= iResolution.x/iResolution.y;
    uv.x *= 1.2 ;
    
    float rand = linearRandom(uv);
    //rand = roundRandom(uv);
    // rand = realRoundRandom(uv);
    // vec3 color = vec3(rand);
    vec3 color = realRoundRandom(uv);
    // color = vec3(rand);

    float o = 1. - max(abs(uv.x) , abs(uv.y) );
    o = o*o*o*(3.-2.*o); // smoothstep(0.,1.,o);
    gl_FragColor = vec4(color * 0.5,o);

}