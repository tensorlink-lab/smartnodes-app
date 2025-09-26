import Particles from "react-tsparticles";
import { useCallback } from "react";
import { loadFull } from "tsparticles";

const ParticleBackground = () => {
    const particlesInit = useCallback(async (engine) => {
        console.log(engine);
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        await console.log(container);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                fpsLimit: 60,
                zLayers: 50,
                interactivity: {
                    detectsOn: "parent",
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "trail",
                        }
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    opacity: {
                        value: {
                            min: 0.3,
                            max: 0.7
                        },
                        random: true
                    },
                    color: {
                        value: "#ff95ba",
                        animation: {
                            h: {
                            count: 0,
                            enable: true,
                            offset: 0,
                            speed: 10,
                            delay: 0,
                            decay: 0,
                            sync: false
                            },
                            s: {
                            count: 0,
                            enable: false,
                            offset: 0,
                            speed: 1,
                            delay: 0,
                            decay: 0,
                            sync: true
                            },
                            l: {
                            count: 0,
                            enable: false,
                            offset: 0,
                            speed: 1,
                            delay: 0,
                            decay: 0,
                            sync: true
                            }
                        }
                    },
                    links: {
                        color: "#555555",
                        distance: 240,
                        enable: true,
                        opacity: 0.7,
                        width: 0.5,
                    },
                    collisions: {
                        enable: true,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 0.25,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 450,   
                        },
                        value: 10,        
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 4 }, 
                    },
                },
                detectRetina: true,
                fullScreen: {
                    enable: true,
                    zIndex: -1
                },
            }}
        />  
    )
}

export default ParticleBackground;