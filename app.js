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
	updateDefSet(zoom,xOff);
	render();
}
const xOffChange = (p)=>{
	document.getElementById("xOff").value	= p;
	document.getElementById("xOffN").value	= p;
	xOff									= p;
	updateDefSet(zoom,xOff);
	render();
}
const accuChange = (p)=>{
	document.getElementById("accu").value	= p;
	document.getElementById("accuN").value	= p;
	accu									= p;
	render();
}
const updateDefSet = (zoom,xOff)=> {
	document.getElementById("min").innerHTML		= -zoom+xOff;
	document.getElementById("max").innerHTML		= zoom+xOff;
}
const getMin = ()=> parseFloat(document.getElementById("min").innerHTML);
const getMax = ()=> parseFloat(document.getElementById("max").innerHTML);
const getZoom = ()=> parseFloat(document.getElementById("zoom").value);
const getxOff = ()=> parseFloat(document.getElementById("xOff").value);
const getAccu = ()=> parseFloat(document.getElementById("accu").value);
var fNameCrnt = "f".charCodeAt(0);

// THREE.JS stuff
var camera, controls, scene, renderer;
var graph			= {};
var zoom			= getZoom();
var xOff			= getxOff();
var accu			= getAccu();

const init = ()=> {
	// camera stuff
		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );
		camera.position.z = 50;
		scene = new THREE.Scene();
	// graph stuff
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
		var code = math.compile(f);
		var res = math.complex();
	// objective attributes
		for (var i=getMin(); i<=getMax(); i+=(getMax()-getMin())/accu) {
			res = math.complex(code.eval({
				"x":i-xOff
			}));
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
