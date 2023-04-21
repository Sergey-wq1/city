import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

// черновой вариант

export class AppBuilder {
  public threeScene: THREE.Scene;

  public threeRenderer: THREE.WebGLRenderer;

  public threeCamera: THREE.PerspectiveCamera;

  // public clock: THREE.Clock;

  constructor() {
    this.threeScene = new THREE.Scene();
    this.threeRenderer = this.makeThreeRenderer();
    this.threeCamera = this.makeThreeCamera();
    this.runRenderCycle();
    this.initLight();
    this.loadModel();
  }

  public syncRendererSize(): void {
    const { parentElement } = this.threeRenderer.domElement;

    if (!parentElement) return;

    const parentSize = new THREE.Vector2(parentElement.offsetWidth, parentElement.offsetHeight);

    const rendererSize = this.threeRenderer.getSize(new THREE.Vector2());

    if (parentSize.equals(rendererSize)) return;

    this.threeRenderer.setSize(parentElement.offsetWidth, parentElement.offsetHeight);
    this.threeCamera.aspect = parentElement.offsetWidth / parentElement.offsetHeight;
    this.threeCamera.updateProjectionMatrix();
  }

  public initLight(): void {
    const intensity = 0.7;
    const light = new THREE.DirectionalLight(0xffffff, intensity);
    light.position.set(1.5, 2.8, 1);
    light.target.position.set(0, 0, 0);
    this.threeScene.add(light);
    light.castShadow = true;
  }

  protected makeThreeRenderer(): THREE.WebGLRenderer {
    return new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
  }

  public runRenderCycle(): void {
    this.threeRenderer.setAnimationLoop(() => {
      this.syncRendererSize();
      this.threeRenderer.render(this.threeScene, this.threeCamera);
    });
  }



  public makeThreeCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(78, window.innerWidth / window.innerHeight, 1, 100);

    camera.position.set(0.4, 1.9, 4);
    camera.lookAt(0, 0, 0);

    return camera;
  }

  public loadModel(): void {
    const loader = new GLTFLoader();
    loader.load('/3d/glb/house.glb', (gltf) => {
      this.threeScene.add(gltf.scene);
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.scale.set(0.1, 0.1, 0.1)
    })
  }


  public setContainer(container: HTMLElement | null): void {
    this.threeRenderer.domElement.remove();

    if (!container) return;
    container.appendChild(this.threeRenderer.domElement);
  }


}
