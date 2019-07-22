// GUI stuff
const collapse = ()=>{
	var cl = document.getElementById("collapse");
	if (cl.style.display=="none") {
		cl.style.display = "block";
	}else{
		cl.style.display = "none";
	}
}
const zoomChange = (p)=>{
	document.getElementById("zoom").value	= p;
	document.getElementById("zoomN").value	= p;
	zoom									= p;
	updateDefSet(zoom,reOff);
	render();
}
const reOffChange = (p)=>{
	document.getElementById("reOff").value	= p;
	document.getElementById("reOffN").value	= p;
	reOff									= p;
	updateDefSet(zoom,reOff);
	render();
}
const imOffChange = (p)=>{
	document.getElementById("imOff").value	= p;
	document.getElementById("imOffN").value	= p;
	imOff									= p;
	updateDefSet(zoom,imOff);
	render();
}

const accuChange = (p)=>{
	document.getElementById("accu").value	= p;
	document.getElementById("accuN").value	= p;
	accu									= p;
	render();
}
const updateDefSet = (zoom,reOff)=> {
	document.getElementById("min").innerHTML		= -zoom+reOff;
	document.getElementById("max").innerHTML		= zoom+reOff;
}
const getMin = ()=> parseFloat(document.getElementById("min").innerHTML);
const getMax = ()=> parseFloat(document.getElementById("max").innerHTML);
const getZoom = ()=> parseFloat(document.getElementById("zoom").value);
const getreOff = ()=> parseFloat(document.getElementById("reOff").value);
const getimOff = ()=> parseFloat(document.getElementById("imOff").value);
const getAccu = ()=> parseFloat(document.getElementById("accu").value);
var fNameCrnt = "f".charCodeAt(0);

// THREE.JS stuff
var camera, controls, scene, renderer;
var arrows;
var graph			= {};
var zoom			= getZoom();
var reOff			= getreOff();
var imOff			= getimOff();
var accu			= getAccu();

const init = ()=> {
	// camera stuff
		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );
		camera.position.z = 20;
		scene = new THREE.Scene();
	// graph stuff
		arrows = new THREE.Group();
		// X Arrow
			let lmx = new THREE.LineBasicMaterial({ color: 0xFF5555 });
			let lgx	= new THREE.Geometry();
				lgx.vertices.push(
					new THREE.Vector3(0,0,0),
					new THREE.Vector3(1,0,0)
				)
			let arrx = new THREE.Line(lgx, lmx);
		// Y Arrow
			let lmy = new THREE.LineBasicMaterial({ color: 0x3FBEBE });
			let lgy	= new THREE.Geometry();
				lgy.vertices.push(
					new THREE.Vector3(0,0,0),
					new THREE.Vector3(0,1,0)
				)
			let arry = new THREE.Line(lgy, lmy);
		// Z Arrow
			let lmz = new THREE.LineBasicMaterial({ color: 0xBEF451 });
			let lgz	= new THREE.Geometry();
				lgz.vertices.push(
					new THREE.Vector3(0,0,0),
					new THREE.Vector3(0,0,1)
				)
			let arrz = new THREE.Line(lgz, lmz);
		scene.add(arrx, arry, arrz);
	// renderer stuff
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		//
		window.addEventListener( 'resize', onWindowResize, false );
	// controls
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.enableKeys = false;
}
const onWindowResize = ()=> {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
const animate = ()=> {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}
const newGraph = (f,clr) => {
	// universal attributes
		var geometry = new THREE.BufferGeometry();
		var material = new THREE.PointsMaterial( {
			size:				4,
			sizeAttenuation:	false,
			alphaTest:			0.5,
			transparent:		true,
			color:				clr
		} );
		var vertices = [];
		if(f[0] != '`')
			var code = math.compile(f);
		else
			f = "f=(x)=>{"+f.replace(/`/g,"")+"}";
		console.log(f)
		var res = math.complex();
	// objective attributes
		for (var i=getMin(); i<=getMax(); i+=(getMax()-getMin())/accu) {
			if(code != undefined){
				res = math.complex(code.evaluate({
					"x":math.complex(i-reOff,-imOff)
					}));
			}else{
				res = math.complex( eval(f) (math.complex(i-reOff,-imOff)) )
			}
				vertices.push(
				i,			/* x */
				res.re,		/* y */
				res.im,		/* z */
			)
		}
		geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
	// adding to scene
		return new THREE.Points( geometry,material );
}
const newFunc = (n,f="x^2",clr="#"+parseInt(Math.random()*0xFFFFFF).toString(16))=>{
	if(n==undefined){
		n=String.fromCharCode(fNameCrnt);
		fNameCrnt++;
	}
	let tr = document.createElement("TR");
	let name = document.createElement("TD");
	let namename = document.createElement("SPAN");
	let param = document.createElement("SPAN");
	let func = document.createElement("TD");
	let expr = document.createElement("INPUT");
	let colr = document.createElement("INPUT");
	let remB = document.createElement("BUTTON");
	tr.className = "function";
	namename.innerHTML = n;
	param.innerHTML = "(x)=";
	remB.innerHTML = "X";
	expr.type = "text";
	expr.value=f;
	colr.type = "color";
	colr.value = clr;

	remB.onclick=function(){
		console.log(this.parentNode.children[1].innerHTML);
		console.log( graph[this.parentNode.children[1].innerHTML] );
		scene.remove( graph[this.parentNode.children[1].innerHTML] );
		this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)
		render();
	}

	func.appendChild(expr);
	func.appendChild(colr);
	name.appendChild(remB);
	name.appendChild(namename);
	name.appendChild(param);
	tr.appendChild(name);
	tr.appendChild(func);

	document.getElementById("funcs").appendChild(tr);
}

const render = ()=> {
	let ch = document.getElementById("funcs").children;
	for (var prop in graph) {
		scene.remove( graph[prop] );
	}
	for (var i=0; i<ch.length; i++) {
		graph[ch[i].children[0].children[1].innerHTML] = newGraph(
			ch[i].children[1].children[0].value,
			ch[i].children[1].children[1].value
		);
		scene.add(graph[ch[i].children[0].children[1].innerHTML]);
	}
}

init();
animate();

//	graph["lal"] = newGraph("e^(i*x/10)*10", 0xffffff);
//	scene.add( graph["lal"] );
