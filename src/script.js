import './style.css'
import {
  Clock,
  Scene,
  LoadingManager,
  WebGLRenderer,
  sRGBEncoding,
  Group,
  PerspectiveCamera,
  DirectionalLight,
  PointLight,
  MeshPhongMaterial,
  TextureLoader,
  AmbientLight
} from 'three';
import {
  TWEEN
} from 'three/examples/jsm/libs/tween.module.min.js';
import {
  DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import '../node_modules/swiper/swiper-bundle.min.js'
// import '../node_modules/swiper/swiper-bundle.min.js.map'


// 定义渲染尺寸
const section = document.getElementsByClassName('section')[0];
let oldMaterial;
let width = section.clientWidth;
let height = section.clientHeight;


// 初始化渲染器
const renderer = new WebGLRenderer({
  canvas: document.querySelector('#canvas-container'),
  antialias: true,
  alpha: true, //透明背景
  powerPreference: 'high-performance'
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.autoClear = true;
renderer.outputEncoding = sRGBEncoding;

// const renderer2 = new WebGLRenderer({
//   canvas: document.querySelector('#canvas-container-details'),
//   antialias: false
// });
// renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer2.setSize(width, height);
// renderer2.outputEncoding = sRGBEncoding;

// const renderer3 = new WebGLRenderer({
//   canvas: document.querySelector('#canvas-container-more'),
//   antialias: false
// });
// renderer3.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //设置 canvas 的像素比为当前设备的屏幕像素比
// renderer3.setSize(width, height); //设置渲染器的尺寸
// renderer3.outputEncoding = sRGBEncoding; //控制输出渲染编码

// 初始化场景
const scene = new Scene();
//场景的雾化效果
// scene.background = new THREE.Color(0x1A1A1A);
// scene.fog = new THREE.Fog(0x1A1A1A, 1, 1000);

// 初始化相机
const cameraGroup = new Group();
scene.add(cameraGroup);
const camera = new PerspectiveCamera(35, width / height, 1, 100)
camera.position.set(19, 1.54, -.1);
cameraGroup.add(camera);
// 相机2
// const camera2 = new PerspectiveCamera(35, section.clientWidth / section.clientHeight, 1, 100);
// camera2.position.set(2.7, 1.0, 4.7);
// camera2.rotation.set(0, 1, 0);
// scene.add(camera2);
// 相机3
//透视相机 PerspectiveCamera(fov能看到的角度范围, aspect渲染窗口的长宽比, near从距离相机多远的位置开始渲染, far停止渲染)
// const camera3 = new PerspectiveCamera(65, width / height, 1, 100);
// camera.position.set(19, 1.54, -.1);
// scene.add(camera3);

// 页面缩放事件监听
window.addEventListener('resize', () => {
  let section = document.getElementsByClassName('section')[0];
  camera.aspect = section.clientWidth / section.clientHeight
  camera.updateProjectionMatrix();
  // camera2.aspect = section.clientWidth / section.clientHeight;
  // camera2.updateProjectionMatrix();
  // camera3.aspect = section.clientWidth / section.clientHeight;
  // camera3.updateProjectionMatrix();
  renderer.setSize(section.clientWidth, section.clientHeight);
  // renderer2.setSize(section.clientWidth, section.clientHeight);
  // renderer3.setSize(section.clientWidth, section.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // renderer3.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// 直射光
const directionLight = new DirectionalLight(0xffffff, .8);
directionLight.position.set(-200, 0, -200);
scene.add(directionLight);

// 点光源(颜色，强度，从光源到光照强度为0的位置，沿着光照距离的衰退量)
const fillLight = new PointLight(0x88ffee, 1.7, 0, 3);
fillLight.position.set(30, 3, 1.8);
scene.add(fillLight);
//环境光
const ambientLight = new AmbientLight(0xdeedff, 1.5);
scene.add(ambientLight);
// light = new THREE.HemisphereLight(0xffffff, 0x444444);
// light.position.set(0, 20, 0);
// scene.add(light);
// light = new THREE.DirectionalLight(0xffffff);
// light.position.set(0, 20, 10);
// light.castShadow = true;
// scene.add(light);

// 加载管理
const ftsLoader = document.querySelector('.lds-roller');
const loadingCover = document.getElementById('loading-text-intro');
// 初始化加载管理器
const loadingManager = new LoadingManager();
loadingManager.onLoad = () => {
  document.onkeydown = function (e) {
    var keyNum = window.event ? e.keyCode : e.which;
    if (keyNum == 32) { //按下空格键进入
      document.querySelector('.content').style.visibility = 'visible'; // 显示
      const yPosition = {
        y: 0
      };
      // 隐藏加载页面动画
      new TWEEN.Tween(yPosition)
        .to({
          y: 100
        }, 900)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
        .onUpdate(() => {
          loadingCover.style.setProperty('transform', `translate(0, ${yPosition.y}%)`)
        })
        .onComplete(function () {
          loadingCover.parentNode.removeChild(document.getElementById('loading-text-intro'));
          ftsLoader.parentNode.removeChild(ftsLoader);
          TWEEN.remove(this);
        });

      // 使用Tween给相机添加入场动画
      new TWEEN.Tween(
          camera.position.set(0, 0, 3))
        .to({
          x: 0,
          y: 0,
          z: 9
        }, 3500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
        .onComplete(function () {
          TWEEN.remove(this);
          document.querySelector('.header').classList.add('ended');
          document.querySelector('.description').classList.add('ended');
        });
    }
  }



  window.scroll(0, 0)
}

// 使用 dracoLoader 加载用blender压缩过的模型
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
dracoLoader.setDecoderConfig({
  type: 'js'
});

// 模型加载
const loader = new GLTFLoader(loadingManager);
loader.setDRACOLoader(dracoLoader);
// const texLoader = new THREE.TextureLoader();
loader.load('/models/MAO.glb', function (gltf) {
  gltf.scene.traverse((obj) => {
    // if (obj.isMesh) {
    //   oldMaterial = obj.material;
    //   obj.material = new MeshPhongMaterial({ shininess: 100 });
    // }
    // if (obj.isMesh) {
    //   obj.material = new MeshPhongMaterial({ 
    //     map: texLoader.load("/models/MAO.jpeg")
    //    });
    // }
  });
  scene.add(gltf.scene);
  oldMaterial.dispose();
  renderer.renderLists.dispose();
});

// 鼠标移动时添加虚拟光标
const cursor = {
  x: 0,
  y: 0
};
document.addEventListener('mousemove', event => {
  event.preventDefault();
  cursor.x = event.clientX / window.innerWidth - .5;
  cursor.y = event.clientY / window.innerHeight - .5;
  document.querySelector('.cursor').style.cssText = `left: ${event.clientX}px; top: ${event.clientY}px;`;
}, false);

// 基于容器视图禁用渲染器
let secondContainer = false;
const ob = new IntersectionObserver(payload => {
  secondContainer = payload[0].intersectionRatio > 0.05;
}, {
  threshold: 0.05
});
ob.observe(document.querySelector('.second'));

// 页面重绘动画
const clock = new Clock()
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  const parallaxY = cursor.y;
  const parallaxX = cursor.x
  fillLight.position.y -= (parallaxY * 9 + fillLight.position.y - 2) * deltaTime;
  fillLight.position.x += (parallaxX * 8 - fillLight.position.x) * 2 * deltaTime;
  cameraGroup.position.z -= (parallaxY / 3 + cameraGroup.position.z) * 2 * deltaTime;
  cameraGroup.position.x += (parallaxX / 3 - cameraGroup.position.x) * 2 * deltaTime;
  TWEEN.update();
  secondContainer ? renderer2.render(scene, camera2) : renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();

// 鼠标悬浮到菜单动画
const btn = document.querySelectorAll('nav > .a');

function update(e) {
  const span = this.querySelector('span');
  if (e.type === 'mouseleave') {
    span.style.cssText = '';
  } else {
    const {
      offsetX: x,
      offsetY: y
    } = e;
    const {
      offsetWidth: width,
      offsetHeight: height
    } = this;
    const walk = 20;
    const xWalk = (x / width) * (walk * 2) - walk,
      yWalk = (y / height) * (walk * 2) - walk;
    span.style.cssText = `transform: translate(${xWalk}px, ${yWalk}px);`
  }
}
btn.forEach(b => b.addEventListener('mousemove', update));
btn.forEach(b => b.addEventListener('mouseleave', update));

// 相机动画
function animateCamera(position, rotation) {
  new TWEEN.Tween(camera2.position)
    .to(position, 1800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
    .onComplete(function () {
      TWEEN.remove(this)
    })
  new TWEEN.Tween(camera2.rotation)
    .to(rotation, 1800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start()
    .onComplete(function () {
      TWEEN.remove(this);
    });
}

// 页面Tab点击事件监听
document.getElementById('one').addEventListener('click', () => {
  document.getElementById('one').classList.add('active');
  document.getElementById('three').classList.remove('active');
  document.getElementById('two').classList.remove('active');
  document.getElementById('four').classList.remove('active');
  document.getElementById('img1').style.display = "block";
  document.getElementById('img2').style.display = "none";
  document.getElementById('img3').style.display = "none";
  document.getElementById('img4').style.display = "none";
  document.getElementById('content').innerHTML = '青年时，毛主席为组织湖南赴法勤工俭学运动第一次到北京。在北京期间，担任北京大学图书馆管理员，得到李大钊等人帮助，开始接受俄国十月革命的思想影响。毛主席后来这么形容这次经历，我自己在北平的生活是十分困苦的。我住在一个叫三眼井的地方，和另外七个人合住一个小房间，我们全体挤在炕上，连呼吸都地方都没有。每逢我翻身都得预先警告身旁的人。不过在公园和故宫的宫址我看到了北国的早春，在坚冰还盖着北海的时候，我看到了怒放的梅花。北京的树木引起了我无穷的欣赏。在困苦的生活中毛主席也总是充满对生活的欣赏和希望。';
  
  // animateCamera({ x: 3.2, y: 2.8, z: 3.2 }, { y: 1 });
});

document.getElementById('two').addEventListener('click', () => {
  document.getElementById('two').classList.add('active');
  document.getElementById('one').classList.remove('active');
  document.getElementById('three').classList.remove('active');
  document.getElementById('four').classList.remove('active');
  document.getElementById('img1').style.display = "none";
  document.getElementById('img2').style.display = "block";
  document.getElementById('img3').style.display = "none";
  document.getElementById('img4').style.display = "none";
  document.getElementById('content').innerHTML = '毛主席进入壮年后，渐渐褪去了学生时代的青涩之气，变得更加务实，这个阶段的毛主席，领导过秋收起义，创建过井冈山革命根据地，当选过中华苏维埃共和国主席，还率领红军走过了两万五千里长征，见证了中国革命的整个摸索期，也为中国革命未来的发展指明了方向。在这个时期，毛主席提出过很多伟大的革命理论，比如“枪杆子里出政权”、“党支部建在连上”、“工农武装割据”、“农村包围城市”、“三大纪律八项注意”、“敌进我退，敌驻我扰，敌疲我打，敌退我追”……可惜，当时的中国共产党还是由知识分子领导，看不上毛主席提出的这些“山大王”思想，让毛主席屡次受到排挤，不得不离开领导岗位。但是，历史已经无数次证明，离开了毛主席的正确领导，中国革命就要走弯路，只有把毛主席重新请出来，中国革命才会顺利前进。';
  
  // animateCamera({ x: -1.4, y: 2.8, z: 4.4 }, { y: -0.1 });
});

document.getElementById('three').addEventListener('click', () => {
  document.getElementById('three').classList.add('active');
  document.getElementById('one').classList.remove('active');
  document.getElementById('two').classList.remove('active');
  document.getElementById('four').classList.remove('active');
  document.getElementById('img1').style.display = "none";
  document.getElementById('img2').style.display = "none";
  document.getElementById('img3').style.display = "block";
  document.getElementById('img4').style.display = "none";
  document.getElementById('content').innerHTML = '毛主席到了中年后，逐渐确立了他在中国革命中的领导地位，地位越来越稳固，面相也越来越“英武”。自从1935年1月遵义会议开始，毛主席就正式成为了中国革命的领军人物，当时他刚刚过去41岁的生日，一个更加伟大的中年时期拉开了序幕。中年时期的毛主席，已经历练出了无人能比的远见卓识，开始在各个领域全面开花，比如在军事方面，领导过抗日战争、解放战争、抗美援朝战争，取得了一个又一个辉煌的胜利，成为让全世界瞩目的伟大军事家。比如在建设方面，毛主席领导创建了中华人民共和国，在一穷二白的基础上，实现了工业、农业、商业的全面发展，全国一片欣欣向荣，连李宗仁都佩服地说：“我不能不说实话，中国从来没有像现在组织得这么好。”比如在理论方面，毛主席写出了《论持久战》《实践论》《矛盾论》等等伟大的著作，更有《毛泽东选集》“雄文四卷，为民立极”，这些伟大的著作，不光在中国家喻户晓，在全世界也拥有无数拥趸，成为世界各国革命者的宝典。比如在文化方面，毛主席创作出了《沁园春·雪》《七律·长征》《七律·人民解放军占领南京》《水调歌头·游泳》等等诗词，文风豪放纵横，气吞千古。';
 
  // animateCamera({ x: -4.8, y: 2.9, z: 3.2 }, { y: -0.75 });
});
document.getElementById('four').addEventListener('click', () => {
  document.getElementById('four').classList.add('active');
  document.getElementById('one').classList.remove('active');
  document.getElementById('two').classList.remove('active');
  document.getElementById('three').classList.remove('active');
  document.getElementById('img1').style.display = "none";
  document.getElementById('img2').style.display = "none";
  document.getElementById('img3').style.display = "none";
  document.getElementById('img4').style.display = "block";
  document.getElementById('content').innerHTML = '毛主席进入壮年后，渐渐褪去了学生时代的青涩之气，变得更加务实，这个阶段的毛主席，领导过秋收起义，创建过井冈山革命根据地，当选过中华苏维埃共和国主席，还率领红军走过了两万五千里长征，见证了中国革命的整个摸索期，也为中国革命未来的发展指明了方向。在这个时期，毛主席提出过很多伟大的革命理论，比如“枪杆子里出政权”、“党支部建在连上”、“工农武装割据”、“农村包围城市”、“三大纪律八项注意”、“敌进我退，敌驻我扰，敌疲我打，敌退我追”……可惜，当时的中国共产党还是由知识分子领导，看不上毛主席提出的这些“山大王”思想，让毛主席屡次受到排挤，不得不离开领导岗位。但是，历史已经无数次证明，离开了毛主席的正确领导，中国革命就要走弯路，只有把毛主席重新请出来，中国革命才会顺利前进。';
  
  // animateCamera({ x: -4.8, y: 2.9, z: 3.2 }, { y: -0.75 });
});
//思想轮播
var swiper = new Swiper(".mySwiper", {
  pagination: {
    el: ".swiper-pagination1",
    dynamicBullets: true,
  },
});

//轮播图
let slideW = 300;
let radius = slideW * 0.5 / Math.sin(Math.PI / 16);
var carouselSwiper = new Swiper('#carousel .swiper', {
  watchSlidesProgress: true,
  slidesPerView: 'auto',
  centeredSlides: false,
  loop: true,
  loopedSlides: 4, 
  grabCursor: true,
  autoplay: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable :true,
  },
  on: {
    progress: function (swiper, progress) {
      for (let i = 0; i < this.slides.length; i++) {
        var slide = this.slides.eq(i);
        var slideProgress = this.slides[i].progress;
        var translateX = (slideProgress + 1.5) * (slideW / 3 - Math.cos((slideProgress + 1.5) *
          0.125 * Math.PI) * slideW * 1.1 / 3) + 'px'; //调整图片间距，根据图片宽度改变数值实现自适应
        let rotateY = (slideProgress + 1.5) * 22.5; //图片角度
        var translateZ = (radius - Math.cos((slideProgress + 1.5) * 0.125 * Math.PI) * radius - 150) +
          'px'; //调整图片远近，刚好4个在画框内
        slide.transform('translateX(' + translateX + ') translateZ(' + translateZ + ') rotateY(' +
          rotateY + 'deg)');
      }
    },
    setTransition: function (swiper, transition) {
      for (var i = 0; i < this.slides.length; i++) {
        var slide = this.slides.eq(i)
        slide.transition(transition);
      }
    }
  }
})