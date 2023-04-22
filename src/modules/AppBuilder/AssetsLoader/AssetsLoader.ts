import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export interface Loader {
  load: (
    url: string,
    onLoad: (result: unknown) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void,
  ) => void;
}

export enum ResourceType {
  GLB = 'GLB',
}

export interface ResourceLoadData<T extends AssetsType> {
  url: string;
  loaded: number;
  total: number;
  content?: unknown;
  type: T;
}

export type AssetsType = ResourceType.GLB;

export class AssetsLoader {
  private readonly gltfLoader;

  private resourceLoadData: ResourceLoadData<AssetsType>[] = [];

  constructor() {
    this.gltfLoader = new GLTFLoader;
  }

  private getAssetsOrFail(url: string): unknown {
    const asset = this.resourceLoadData.find((asset) => asset.url === url);
    if (!asset) throw new Error(`Assets content for ${url} not found`);
    return asset.content;
  }

  public getGLTFAssetResource(url: string): GLTF {
    return this.getAssetsOrFail(url) as GLTF;
  }

  public setGLTFAssetResourse(url: string, type: ResourceType): void {
    const resource = this.resourceLoadData.find((item) => item.url === url);
    if (resource) return;
    const data = { type: type, url: url, total: 0, loaded: false };
    this.resourceLoadData.push(data as ResourceLoadData<AssetsType>);
  }

  private checkAllResources(): boolean {
    return !!this.resourceLoadData.find((item) => item.loaded);
  }

  public loadResource():Promise<void> {
    if (this.checkAllResources()) return Promise.resolve();
    return Promise
      .all(this.resourceLoadData.map((item) => {
        if (item.loaded) return Promise.resolve();

        return this.load(item.url, item);
      }))
      .then(() => Promise.resolve());
  }

  private getAssetsByType(resource: AssetsType): Loader {
    if (resource === ResourceType.GLB) return this.gltfLoader;
    throw new Error('Not find asset type');
  }

  private load(url: string, resource: ResourceLoadData<AssetsType>): Promise<void> {
    const loader = this.getAssetsByType(resource.type);
    return new Promise((resolve) => {
      loader.load(url, (data) => {
        resolve();
        resource.content = data;
      })
    })
  }
}
