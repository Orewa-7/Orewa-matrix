void main()
{
    // Final color
    float d = length(gl_PointCoord - vec2(0.5));
    d = 1. -step(0.4, d);
    
    vec3 color = vec3(d) * 0.1;
    gl_FragColor = vec4(color, d);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}