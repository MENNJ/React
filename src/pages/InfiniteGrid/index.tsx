import { useState, useEffect } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

const InfiniteGridPage = () => {
  const images = [
    'https://images.pexels.com/photos/18173391/pexels-photo-18173391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/24460824/pexels-photo-24460824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/21533296/pexels-photo-21533296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/3009205/pexels-photo-3009205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/27143629/pexels-photo-27143629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/27216502/pexels-photo-27216502.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/27139481/pexels-photo-27139481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/17266857/pexels-photo-17266857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/5290758/pexels-photo-5290758.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/5267760/pexels-photo-5267760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/425160/pexels-photo-425160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1038935/pexels-photo-1038935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/2681319/pexels-photo-2681319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1122409/pexels-photo-1122409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1010079/pexels-photo-1010079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/763097/pexels-photo-763097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/711022/pexels-photo-711022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1229102/pexels-photo-1229102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1115204/pexels-photo-1115204.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/3299386/pexels-photo-3299386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/925743/pexels-photo-925743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1258333/pexels-photo-1258333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ]

  const [isDisplay] = useState(true)

  useEffect(() => {
    let ww = window.innerWidth
    let wh = window.innerHeight

    class Core {
      isDisplay: boolean;
      lastClickedPlane: Plane | null = null;
      initialScreenX: number = 0;
      initialScreenY: number = 0;
      tx = 0
      ty = 0
      cx = 0
      cy = 0
      diff = 0
      on = { x: 0, y: 0 }
      max = { x: 0, y: 0 }
      isDragging = false
      isMoved = false
      start = { x: 0, y: 0 }
      end = { x: 0, y: 0 }
      tl = gsap.timeline({ paused: true })
      el = document.querySelector('.js-grid') as HTMLElement
      scene = new THREE.Scene()
      camera = new THREE.OrthographicCamera(
        ww / -2,
        ww / 2,
        wh / 2,
        wh / -2,
        1,
        1000
      )
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      planes: Plane[] = []
      raycaster = new THREE.Raycaster()
      mouse = new THREE.Vector2()

      constructor() {
        this.isDisplay = true; 
        this.camera.lookAt(this.scene.position)
        this.camera.position.z = 1
        this.renderer.setSize(ww, wh)
        this.renderer.setPixelRatio(
          gsap.utils.clamp(1, 1.5, window.devicePixelRatio)
        )
        document.body.appendChild(this.renderer.domElement)
        this.addPlanes()
        this.addEvents()
        this.resize()
      }

      addEvents() {
        gsap.ticker.add(this.tick)

        window.addEventListener('mousemove', this.onMouseMove)
        window.addEventListener('mousedown', this.onMouseDown)
        window.addEventListener('mouseup', this.onMouseUp)
        window.addEventListener('touchmove', this.onTouchMove, {
          passive: false
        })
        window.addEventListener('touchstart', this.onTouchStart, {
          passive: false
        })
        window.addEventListener('touchend', this.onTouchEnd)
        window.addEventListener('resize', this.onWindowResize)
        this.el.addEventListener('click', this.onClick)
      }

      addPlanes() {
        const planes = [...document.querySelectorAll('.js-plane')]
        this.planes = planes.map((el, i) => {
          const plane = new Plane()
          plane.init(el as HTMLElement, i)
          this.scene.add(plane)
          return plane
        })
      }
      onWindowResize = () => {
        ww = window.innerWidth
        wh = window.innerHeight

        this.camera.left = ww / -2
        this.camera.right = ww / 2
        this.camera.top = wh / 2
        this.camera.bottom = wh / -2
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(ww, wh)
        this.resize()
      }

      onClick = (event: MouseEvent) => {
        if (this.isMoved) return;
      
        let imgElement = document.querySelector('img') as HTMLImageElement;
        let divElement = document.querySelector('.DOM') as HTMLDivElement;
        let BUTTONElement = document.querySelector('.BUTTON') as HTMLDivElement;
      
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.planes.map((plane) => plane.mesh));
      
        if (intersects.length > 0) {
          const intersectedObject = intersects[0].object as THREE.Mesh;
          const plane = this.planes.find((p) => p.mesh === intersectedObject);
      
          if (plane) {
            const position = plane.position.clone();
            const { width, height } = plane.rect;
            const vector = position.project(this.camera);
            const screenX = ((vector.x + 1) / 2) * window.innerWidth - width / 2;
            const screenY = (-(vector.y - 1) / 2) * window.innerHeight - height / 2;
      
            if (this.isDisplay) {
              this.lastClickedPlane = plane; 
              this.initialScreenX = screenX; 
              this.initialScreenY = screenY; 
      
              const src = plane.el.dataset.src!;
              imgElement.src = src;
              imgElement.style.width = `${width}px`;
              imgElement.style.height = `${height}px`;
      
              gsap.set(imgElement, {
                x: screenX,
                y: screenY
              });
      
              divElement.style.display = 'block';
              gsap.to(imgElement, {
                duration: 0.7,
                x: window.innerWidth / 2 - width / 2,
                y: window.innerHeight / 2 - height / 2,
                ease: 'power3.inOut'
              });
      
              gsap.to(divElement, {
                duration: 0.7,
                backgroundColor: 'white',
                ease: 'power2.inOut'
              });
      
              gsap.to(BUTTONElement, {
                duration: 0.7,
                opacity: 1,
                ease: 'power2.inOut'
              });
      
              this.setIsDisplay(false);
            } else if (this.lastClickedPlane) {
              gsap.to(imgElement, {
                duration: 0.7,
                x: this.initialScreenX,
                y: this.initialScreenY,
                ease: 'power2.inOut'
              });
      
              gsap.to(divElement, {
                duration: 0.7,
                backgroundColor: 'transparent',
                ease: 'power2.inOut'
              });
      
              gsap.to(divElement, {
                duration: 0.7,
                display: 'none',
                ease: 'power2.inOut'
              });
      
              gsap.to(BUTTONElement, {
                duration: 0.1,
                opacity: 0,
                ease: 'power2.inOut'
              });
      
              this.setIsDisplay(true);
            }
          }
        }
      }

      setIsDisplay(display: boolean) {
        this.isDisplay = display;
      }
      

      tick = () => {
        const xDiff = this.tx - this.cx
        const yDiff = this.ty - this.cy

        this.cx += xDiff * 0.085
        this.cx = Math.round(this.cx * 100) / 100

        this.cy += yDiff * 0.085
        this.cy = Math.round(this.cy * 100) / 100

        this.diff = Math.max(Math.abs(yDiff * 0.0001), Math.abs(xDiff * 0.0001))

        this.planes.length &&
          this.planes.forEach((plane) =>
            plane.update(this.cx, this.cy, this.max, this.diff)
          )

        this.renderer.render(this.scene, this.camera)
      }

      onMouseMove = ({ clientX, clientY }: MouseEvent) => {
        if (!this.isDragging) return
        this.isMoved = true
        this.tx = this.on.x + clientX * 2.5
        this.ty = this.on.y - clientY * 2.5
      }

      onMouseDown = ({ clientX, clientY }: MouseEvent) => {
        if (this.isDragging) return
        this.isMoved = false
        this.isDragging = true
        this.on.x = this.tx - clientX * 2.5
        this.on.y = this.ty + clientY * 2.5
        this.start.x = clientX
        this.start.y = clientY
      }

      onMouseUp = ({ clientX, clientY }: MouseEvent) => {
        if (!this.isDragging) return
        this.isDragging = false
        this.end.x = clientX
        this.end.y = clientY

        if (
          Math.abs(this.end.x - this.start.x) < 5 &&
          Math.abs(this.end.y - this.start.y) < 5
        ) {
          this.isMoved = false
        } else {
          this.isMoved = true
        }
      }

      onTouchMove = (event: TouchEvent) => {
        event.preventDefault()
        if (!this.isDragging) return
        this.isMoved = true
        const touch = event.touches[0]
        this.tx = this.on.x + touch.clientX * 2.5
        this.ty = this.on.y - touch.clientY * 2.5
      }

      onTouchStart = (event: TouchEvent) => {
        if (this.isDragging) return
        this.isMoved = false
        this.isDragging = true
        const touch = event.touches[0]
        this.on.x = this.tx - touch.clientX * 2.5
        this.on.y = this.ty + touch.clientY * 2.5
        this.start.x = touch.clientX
        this.start.y = touch.clientY
      }

      onTouchEnd = (event: TouchEvent) => {
        if (!this.isDragging) return
        this.isDragging = false
        const touch = event.changedTouches[0]
        this.end.x = touch.clientX
        this.end.y = touch.clientY

        if (
          Math.abs(this.end.x - this.start.x) < 5 &&
          Math.abs(this.end.y - this.start.y) < 5
        ) {
          this.isMoved = false
        } else {
          this.isMoved = true
        }
      }

      resize = () => {
        this.planes.forEach((plane) => {
          plane.resize()
          plane.update(this.cx, this.cy, this.max, this.diff)
        })
        const { bottom, right } = this.el.getBoundingClientRect()

        this.max.x = right
        this.max.y = bottom
      }
    }
    const loader = new THREE.TextureLoader()

    const vertexShader = `
        precision mediump float;

        uniform float u_diff;

        varying vec2 vUv;

        void main(){
          vec3 pos = position;

          pos.y *= 1. - u_diff;
          pos.x *= 1. - u_diff;

          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);;
        }
      `

    const fragmentShader = `
        precision mediump float;

        uniform vec2 u_res;
        uniform vec2 u_size;
        
        uniform sampler2D u_texture;
        
        vec2 cover(vec2 screenSize, vec2 imageSize, vec2 uv) {
          float screenRatio = screenSize.x / screenSize.y;
          float imageRatio = imageSize.x / imageSize.y;
        
          vec2 newSize = screenRatio < imageRatio
              ? vec2(imageSize.x * (screenSize.y / imageSize.y), screenSize.y)
              : vec2(screenSize.x, imageSize.y * (screenSize.x / imageSize.x));
          vec2 newOffset = (screenRatio < imageRatio
              ? vec2((newSize.x - screenSize.x) / 2.0, 0.0)
              : vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;
          return uv * screenSize / newSize + newOffset;
        }
        
        float roundBox(vec2 p, vec2 b, float r){
          return length(max(abs(p)-b+r,0.0))-r;
        }
        
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
        
          vec2 uvCover = cover(u_res, u_size, uv);
          vec4 texture = texture2D(u_texture, uvCover);
        
          vec2 halfSize = u_res * 0.5;
          vec2 coord = uv * u_res;
          vec2 p = coord - halfSize;
        
          float a = roundBox(p, halfSize, 24.0);

          float boxAlpha = smoothstep(0.0, 1.0, a);
        
          vec4 finalColor = vec4(texture.rgb, texture.a * (1.0 - boxAlpha));
        
          gl_FragColor = finalColor;
        }

      `

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader
    })

    class Plane extends THREE.Object3D {
      el!: HTMLElement
      x = 0
      y = 0
      my = 1
      geometry = geometry
      material = material.clone()
      texture!: THREE.Texture
      mesh!: THREE.Mesh
      rect!: DOMRect
      xOffset = 0
      yOffset = 0
      declare position: any

      init(el: HTMLElement, i: number) {
        this.el = el
        this.my = 1

        this.material.uniforms = {
          u_texture: { value: 0 },
          u_res: { value: new THREE.Vector2(1, 1) },
          u_size: { value: new THREE.Vector2(1, 1) },
          u_diff: { value: 0 }
        }

        this.texture = loader.load(
          this.el.dataset.src!,
          (texture: {
            minFilter: number
            generateMipmaps: boolean
            image: { naturalWidth: any; naturalHeight: any }
          }) => {
            texture.minFilter = THREE.LinearFilter
            texture.generateMipmaps = false

            const { naturalWidth, naturalHeight } = texture.image
            const { u_size, u_texture } = this.material.uniforms

            u_texture.value = texture
            u_size.value.x = naturalWidth
            u_size.value.y = naturalHeight
          }
        )

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.add(this.mesh)

        this.resize()
      }

      update = (
        x: number,
        y: number,
        max: { x: number; y: number },
        diff: number
      ) => {
        const { right, bottom } = this.rect
        const { u_diff } = this.material.uniforms

        this.y =
          gsap.utils.wrap(-(max.y - bottom), bottom, y * this.my) - this.yOffset
        this.x = gsap.utils.wrap(-(max.x - right), right, x) - this.xOffset

        u_diff.value = diff

        this.position.x = this.x
        this.position.y = this.y
      }

      resize() {
        this.rect = this.el.getBoundingClientRect()

        const { left, top, width, height } = this.rect
        const { u_res } = this.material.uniforms

        this.xOffset = left + width / 2 - window.innerWidth / 2
        this.yOffset = top + height / 2 - window.innerHeight / 2

        this.position.x = this.xOffset
        this.position.y = this.yOffset

        u_res.value.x = width
        u_res.value.y = height

        this.mesh.scale.set(width, height, 1)
      }
    }

    new Core()
  }, [isDisplay])

  return (
    <div>
      <div>
        <div className='fixed w-[150%] h-[200%]  z-[0] grid 2xl:grid-cols-[repeat(6,1fr)] xl:grid-cols-[repeat(4,1fr)] lg:grid-cols-[repeat(4,1fr)] md:grid-cols-[repeat(3,1fr)] grid-cols-[repeat(3,1fr)] left-0 top-0 js-grid'>
          {images.map((src, index) => {
            return (
              <div className='relative' key={index}>
                <figure
                  className='js-plane inset-2 absolute m-0 p-0'
                  data-src={src}
                ></figure>
              </div>
            )
          })}
        </div>
        <div className='page js-page'></div>
        <div className='DOM w-screen h-screen'>
          <img className='rounded-3xl object-cover' alt='alt' />
        </div>
      </div>
      <div className='BUTTON fixed bottom-[15%] opacity-0 w-full flex justify-center'>
        <button className='text-[#090909] text-lg cursor-pointer  transition-all duration-[0.3s] shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] px-[1.7em] py-[0.7em] rounded-[0.5em] border-solid border-[#e8e8e8] active:text-[#666] active:shadow-[inset_4px_4px_12px_#c5c5c5,inset_-4px_-4px_12px_#ffffff]'>
          Click me
        </button>
      </div>
    </div>
  )
}

export default InfiniteGridPage
