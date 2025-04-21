// 导入 three
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 导入 轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入 GUI
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 导入 GLTFLoader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// 导入 dracoLoader
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// 导入 变换控制器
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

// 创建场景
const scene = new THREE.Scene();

// 创建相机 透视相机--近大远小
const camera = new THREE.PerspectiveCamera(
  45, // 视野角度
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近端面--最近能看到的
  1000 // 远端面--最远能看到的
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 开启抗锯齿
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // 将 canvas画布 添加到页面
// 设置色调映射
renderer.toneMapping = THREE.ReinhardToneMapping;
// 设置色调映射曝光
renderer.toneMappingExposure = 1;

// 设置相机位置
camera.position.z = 8;
camera.position.y = 2.5;
camera.position.x = 3;
camera.lookAt(0, 1.2, 0); // 设置相机朝向--如果有控制器，也要设置控制器的 target

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 【注意】：添加轨道控制器--一般是用 画布renderer.domElement 来做参数，不然全屏无效
const controls = new OrbitControls(camera, renderer.domElement);
// 设置带阻尼的惯性
controls.enableDamping = true;
// 设置阻尼系数
controls.dampingFactor = 0.05;
// 设置自动旋转
// controls.autoRotate = true;
// 设置控制器的target

// 控制镜头
/* 
controls.target.set(0, 1.2, 0);
// 禁止平移
controls.enablePan = false;
// 设置最小距离--与物体的距离(target)
controls.minDistance = 3;
// 设置最大距离--与物体的距离(target)
controls.maxDistance = 5;

// 垂直--根据 y轴
// 设置垂直最小角度
controls.minPolarAngle = Math.PI / 2 - Math.PI / 12;
// 设置垂直最大角度
controls.maxPolarAngle = Math.PI / 2;

// 水平--根据 z轴
// 设置水平最小角度
controls.minAzimuthAngle = Math.PI / 2 - Math.PI / 12;
// 设置水平最大角度
controls.maxAzimuthAngle = Math.PI / 2 + Math.PI / 12; 
*/

// 网格辅助器
const gridHelper = new THREE.GridHelper(50, 50);
// 设置网格透明度
gridHelper.material.opacity = 0.3;
// 设置网格允许透明
gridHelper.material.transparent = true;
scene.add(gridHelper);

// 循环渲染
function animate() {
  requestAnimationFrame(animate);

  controls.update(); // 更新控制器，必须调用，不然 阻尼效果 无效

  /*  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01; */

  // 必须要重新渲染
  renderer.render(scene, camera);
}

// 渲染
animate();

// 监听窗口变化
window.addEventListener("resize", () => {
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 更新相机宽高比--必须的，不然 物体会变形
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机投影矩阵--必须的，更改宽高比后要重新计算投影矩阵
  camera.updateProjectionMatrix();
});

// 添加全屏按钮
const btn = document.createElement("button");
btn.innerText = "全屏";
btn.style.position = "fixed";
btn.style.top = "10px";
btn.style.left = "10px";
document.body.appendChild(btn);

// 监听全屏按钮点击事件
btn.addEventListener("click", () => {
  // 判断是否全屏
  if (!document.fullscreenElement) {
    // 【注意】：全屏--必须是 document.body 对象调用，不能是 document，不然无效。
    document.body.requestFullscreen();
  }
});

// 监听退出全屏事件
const btn1 = document.createElement("button");
btn1.innerText = "退出全屏";
btn1.style.position = "fixed";
btn1.style.top = "10px";
btn1.style.left = "100px";
document.body.appendChild(btn1);

// 监听退出全屏按钮点击事件
btn1.addEventListener("click", () => {
  // 判断是否全屏
  if (document.fullscreenElement) {
    // 【注意】：退出全屏--必须是 document 对象调用，不能是 document.body，不然无效。
    document.exitFullscreen();
  }
});

// 实例化 hdr
const rgbeLoader = new RGBELoader();
// 加载 hdr
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  // 设置环境贴图--反射
  // envMap.mapping = THREE.EquirectangularReflectionMapping;
  // 设置环境贴图--折射
  envMap.mapping = THREE.EquirectangularRefractionMapping;
  // 设置环境贴图强度
  scene.environment = envMap;
  // 设置环境贴图强度
  // scene.background = envMap;
  scene.background = new THREE.Color(0xcccccc);
});

// 实例化加载器 gltfLoader
const gltfLoader = new GLTFLoader();
// 实例化加载器 draco
const dracoLoader = new DRACOLoader();
// 设置 draco 路径
dracoLoader.setDecoderPath("./draco/");
// 设置 gltf 加载器 draco 解码器
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("./model/house/house-scene-min.glb", (gltf) => {
  basicScene = gltf.scene;
});

// 实例化 变换控制器
const tControls = new TransformControls(camera, renderer.domElement);
// 变换控制器变化时，重新渲染--不能调用 animate，会很卡顿，因为 animate 是循环渲染
tControls.addEventListener("change", () => {
  // console.log("变换控制器变化了: ");
  // animate()
  if (eventObj.isSnapToGround) {
    tControls.object.position.y = 0;
  }
});
// 拖动变换控制器时，禁用相机控制
tControls.addEventListener("dragging-changed", (event) => {
  controls.enabled = !event.value;
});
scene.add(tControls);

// 基础模型
let basicScene;
let eventObj = {
  Fullscreen: function () {
    // 判断是否全屏
    if (!document.fullscreenElement) {
      // 【注意】：全屏--必须是 document.body 对象调用，不能是 document，不然无效。
      document.body.requestFullscreen();
    }
  },
  ExitFullscreen: function () {
    // 判断是否全屏
    if (document.fullscreenElement) {
      // 【注意】：退出全屏--必须是 document 对象调用，不能是 document.body，不然无效。
      document.exitFullscreen();
    }
  },
  // 添加户型基础模型
  addBasicScene: function () {
    scene.add(basicScene);
  },
  // 位移模式
  setTranslate: function () {
    tControls.setMode("translate");
  },
  // 旋转模式
  setRotate: function () {
    tControls.setMode("rotate");
  },
  // 缩放模式
  setScale: function () {
    tControls.setMode("scale");
  },
  // 切换空间模式
  toggleSpace: function () {
    tControls.setSpace(tControls.space === "local" ? "world" : "local");
  },
  // 取消选择
  cancelMesh: function () {
    tControls.detach();
  },
  // 固定位移距离
  translateSnapNum: null,
  // 固定旋转角度
  rotateSnapNum: 0, // 不能是 null
  // 固定缩放比例
  scaleSnapNum: 0,
  // 是否吸附地面
  isSnapToGround: false,
  // 是否开启灯光
  isLight: true,
};

// 家具列表--提前定义好 名字 和 路径，用于 gui 的创建
const meshList = [
  {
    name: "盆栽",
    path: "./model/house/plants-min.glb",
  },
  {
    name: "单人沙发",
    path: "./model/house/sofa_chair_min.glb",
  },
];

// 存放家具的列表，与场景的物体列表有区别
const sceneMeshes = [];

// 添加GUI
const gui = new GUI();
gui.add(eventObj, "addBasicScene").name("添加户型基础模型");
gui.add(eventObj, "setTranslate").name("位移模式");
gui.add(eventObj, "setRotate").name("旋转模式");
gui.add(eventObj, "setScale").name("缩放模式");
gui.add(eventObj, "toggleSpace").name("切换空间模式");
gui.add(eventObj, "cancelMesh").name("取消选择");
gui.add(eventObj, "isSnapToGround").name("是否吸附地面");
gui
  .add(eventObj, "isLight")
  .name("是否开启灯光")
  .onChange((value) => {
    if (value) {
      renderer.toneMappingExposure = 1;
    } else {
      renderer.toneMappingExposure = 0;
    }
  });

// 监听键盘事件
document.addEventListener("keydown", (event) => {
  if (event.key === "f") {
    eventObj.Fullscreen();
  }
  if (event.key === "Escape") {
    eventObj.ExitFullscreen();
  }
  // 监听是否是 t 键
  if (event.key === "t") {
    eventObj.setTranslate();
  }
  // 监听是否是 r 键
  if (event.key === "r") {
    eventObj.setRotate();
  }
  // 监听是否是 s 键
  if (event.key === "s") {
    eventObj.setScale();
  }
});

// 创建添加家具的 gui文件夹
const addMeshFolder = gui.addFolder("添加物体");
// 循环家具列表
meshList.forEach((item, index) => {
  // 为每个家具添加一个用于gui添加家具的方法
  let meshesNum = {};
  item.addMesh = function () {
    // 先加载模型
    gltfLoader.load(item.path, (gltf) => {
      // 添加模型
      let object3d = gltf.scene;
      sceneMeshes.push({
        ...item,
        object3d,
      });
      scene.add(object3d);
      tControlSelected(object3d);

      // 添加到 已添加的物体列表，作选中
      let meshOpt = {
        toggleMesh: function () {
          tControlSelected(object3d);
        },
      };
      meshesNum[item.name] = meshesNum[item.name]
        ? meshesNum[item.name] + 1
        : 1;
      meshFolder
        .add(meshOpt, "toggleMesh")
        .name(item.name + meshesNum[item.name]);
    });
  };
  // add 的对象是 item，而不是 eventObj
  addMeshFolder.add(item, "addMesh").name(item.name);
});

// 变换控制器选中物体的函数
function tControlSelected(mesh) {
  tControls.attach(mesh);
}

const meshFolder = gui.addFolder("物体列表");

const snapFolder = gui.addFolder("固定设置");
snapFolder
  .add(eventObj, "translateSnapNum", {
    "0.1m": 0.1,
    "0.5m": 0.5,
    "1m": 1,
    "3m": 3,
    "5m": 5,
    "10m": 10,
    "100m": 100,
    不固定: null,
  })
  .name("固定位移距离")
  .onChange((value) => {
    tControls.setTranslationSnap(value);
  });
snapFolder
  .add(eventObj, "rotateSnapNum", 0, 1)
  .step(0.01)
  .name("固定旋转角度")
  .onChange((value) => {
    tControls.setRotationSnap(value * Math.PI * 2);
  });

snapFolder
  .add(eventObj, "scaleSnapNum", 0, 2)
  .step(0.01)
  .name("固定缩放比例")
  .onChange((value) => {
    tControls.setScaleSnap(value);
  });

snapFolder.add(eventObj, "isSnapToGround").name("吸附地面");
