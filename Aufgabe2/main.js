function SceneManager(canvas) {
    const scene = buildScene();
    const renderer = buildRenderer(canvas);
    const camera = buildCamera();
    const cube = buildCube();
    buildKoordinatensystem();

    function buildScene() {
        const scene = new THREE.Scene();
        return scene;
    }

    function buildRenderer(canvas) {
        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvas.appendChild(renderer.domElement);
        return renderer;
    }

    function buildCamera() {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 4;
        return camera;
    }

    function buildCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
        const material = new THREE.MeshBasicMaterial({ vertexColors: true });
        const positionAttribute = geometry.getAttribute('position');
        const colors = [];
        const color = new THREE.Color();

        for (let i = 0; i < positionAttribute.count; i += 6) {
            color.setHex(0xffffff * Math.random());

            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);

            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        const cube = new THREE.Mesh(geometry, material);


        const vektor = new THREE.Vector3(1 / Math.sqrt(2), 1 / Math.sqrt(2), 0);
        cube.rotateOnWorldAxis(vektor, Math.PI / 6);
        cube.position.set(1, 1, 1);

        var geo = new THREE.EdgesGeometry(cube.geometry);
        var mat = new THREE.LineBasicMaterial({ color: 0x000000 });
        var wireframe = new THREE.LineSegments(geo, mat);
        cube.add(wireframe);
        scene.add(cube);
        return cube;
    }

    function buildKoordinatensystem() {
        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

        let points = [];
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(100, 0, 0));
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        let line = new THREE.Line(geometry, material);
        scene.add(line);

        points = [];
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(0, 100, 0));
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        line = new THREE.Line(geometry, material);
        scene.add(line);

        points = [];
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(0, 0, 100));
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        line = new THREE.Line(geometry, material);
        scene.add(line);
    }

    this.update = function() {
        renderer.render(scene, camera);
    }
}

const canvas = document.getElementById("canvas");
const sceneManager = new SceneManager(canvas);

function animate() {
    requestAnimationFrame(animate);
    sceneManager.update();
}
animate();